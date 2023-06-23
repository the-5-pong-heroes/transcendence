import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import * as bcrypt from "bcrypt";
import { UseInterceptors } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ChannelUsersService } from "../channel-users/channel-users.service";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "../user/user.service";
import { MessagesService } from "../messages/messages.service";
import { ChannelsService } from "./channels.service";
import {
  CreateChannelDto,
  CreateDirectChannelDto,
  UserWantJoinChannelDto,
  ConfirmJoinDto,
  SubmitPasswordDto,
  UpdateChannelTypeDto,
  UnbanChannelUserDto,
  DeleteChannelDto,
} from "./dto";
import { UpdateChannelUserDto, ChannelUserIdDto, BanChannelUserDto } from "../channel-users/dto";
import { CreateMessageDto, DisableInvitationDto } from "../messages/dto";
import { BlockedUserDto } from "../user/dto";
import { BlockedService } from "src/blocked/blocked.service";
import { WebSocketInterceptor } from "src/common/interceptors";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@UseInterceptors(WebSocketInterceptor)
export class ChannelsGateway {
  constructor(
    private prismaService: PrismaService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private ChannelUsersService: ChannelUsersService,
    private userService: UserService,
    private blockedService: BlockedService,
  ) {}

  @WebSocketServer() server!: Server;

  @SubscribeMessage("create")
  async create(client: Socket, payload: CreateChannelDto) {
    if (payload.name === "") return "Channel must have name.";
    const user = await this.userService.findOneById(payload.users.userId);
    if (!user) return "User does not exist";
    if (payload.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(payload.password, salt);
	  payload.password = hash;
    }
    const channel = await this.channelsService.create(payload);
    await this.messagesService.create({
      content: `${user.name} created the channel`,
      channelId: channel.id,
    });
    client.emit("updateChannels", true);
  }

  async createDirectChannel(client: Socket, payload: CreateDirectChannelDto) {
    const user = await this.userService.findOneById(payload.channelId);
    if (!user) return "User does not exist";
    payload.type = "DIRECT";
    const channel = await this.channelsService.createDirect(payload);
    await this.ChannelUsersService.create({
      channelId: channel.id,
      userId: payload.userId,
    });
    await this.ChannelUsersService.create({
      channelId: channel.id,
      userId: payload.channelId,
    });
    this.server.emit("updateChannels", false);
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("wantJoin")
  async wantJoin(client: Socket, payload: UserWantJoinChannelDto) {
    if (payload.type === undefined) return this.createDirectChannel(client, payload);
    const channel = await this.channelsService.findOne(payload.channelId);
    const banChannel = await this.prismaService.channelBan.findFirst({
      where: {
        channelId: payload.channelId,
        userId: payload.userId,
      },
    });
    if (banChannel) return;
    const { type: _, ...channelUser } = payload;
    if (channel.type === "PROTECTED") await this.ChannelUsersService.create({ ...channelUser, isAuthorized: false });
    else await this.ChannelUsersService.create(channelUser);
    if (channel.type !== "PROTECTED") return this.confirmJoin(client, payload);
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("confirmJoin")
  async confirmJoin(client: Socket, payload: ConfirmJoinDto) {
    const user = await this.userService.findOneById(payload.userId);
    if (!user) return "This user does not exist.";
    this.handleMessage(client, {
      content: `${user.name} joined`,
      channelId: payload.channelId,
    });
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("submitPassword")
  async submitPassword(client: Socket, payload: SubmitPasswordDto) {
    const channel = await this.channelsService.findOne(payload.channelId);
    if (!channel) return "Channel does not exist.";
	const isMatch = await bcrypt.compare(payload.password, channel.password);
    if (!isMatch) return "Password does not match.";
    const channelUser = await this.ChannelUsersService.findFirst({
      channelId: payload.channelId,
      userId: payload.userId,
    });
    if (!channelUser) return "This user is not on this channel.";
    await this.ChannelUsersService.update({ id: channelUser.id, isAuthorized: true });
    this.confirmJoin(client, { userId: payload.userId, channelId: payload.channelId });
  }

  @SubscribeMessage("updateChannelType")
  async updateChannelType(client: Socket, payload: UpdateChannelTypeDto) {
	const oldPassword = payload.password;
    if (payload.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(payload.password, salt);
	  payload.password = hash;
    }
    const channel = await this.channelsService.update(payload);
    this.handleMessage(client, {
      content: `Channel mode is now ${channel.type}`,
      channelId: channel.id,
    });
    if (channel.type === "PROTECTED") {
      this.handleMessage(client, {
        content: `Channel password is now "${oldPassword}"`,
        channelId: channel.id,
      });
    }
  }

  @SubscribeMessage("updateChannelUser")
  async updateChannelUser(client: Socket, payload: UpdateChannelUserDto) {
    const channelUser = await this.ChannelUsersService.update(payload);
    const user = await this.userService.findOneById(channelUser.userId);
    if (!user) return "User does not exist.";
    if (payload.role)
      this.handleMessage(client, {
        content: `${user.name} is now ${channelUser.role}`,
        channelId: channelUser.channelId,
      });
    if (payload.isMuted !== undefined) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "Europe/Paris",
      };
      this.handleMessage(client, {
        content: `${user.name} is now ${
          channelUser.isMuted && payload.mutedUntil
            ? `mute until ${new Date(payload.mutedUntil).toLocaleDateString("fr-FR", options)}`
            : "unmute"
        }`,
        channelId: channelUser.channelId,
      });
      if (payload.isMuted && payload.mutedUntil) {
        setTimeout(async () => {
          const newChannelUser = await this.ChannelUsersService.findOne(payload.id);
          if (!newChannelUser || !newChannelUser.mutedUntil) return;
          if (new Date(newChannelUser.mutedUntil) < new Date() && newChannelUser.isMuted) {
            await this.ChannelUsersService.update({
              id: payload.id,
              isMuted: false,
            });
            this.handleMessage(client, {
              content: `${user.name} is now unmute`,
              channelId: channelUser.channelId,
            });
          }
        }, new Date(payload.mutedUntil).getTime() - new Date().getTime());
      }
    }
  }

  @SubscribeMessage("kickChannelUser")
  async kickChannelUser(client: Socket, payload: ChannelUserIdDto) {
    const { user, channelId } = await this.ChannelUsersService.findUser(payload.id);
    await this.ChannelUsersService.delete(payload.id);
    this.handleMessage(client, {
      content: `${user.name} has been kicked`,
      channelId: channelId,
    });
  }

  @SubscribeMessage("banChannelUser")
  async banChannelUser(client: Socket, payload: BanChannelUserDto) {
    if (new Date(payload.bannedUntil).getTime() - new Date().getTime() <= 0) return;
    const { user, channelId } = await this.ChannelUsersService.findUser(payload.id);
    await this.ChannelUsersService.delete(payload.id);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Paris",
    };
    this.handleMessage(client, {
      content: `${user.name} has been banned until ${new Date(payload.bannedUntil).toLocaleDateString(
        "fr-FR",
        options,
      )}`,
      channelId: channelId,
    });
    await this.prismaService.channelBan.create({
      data: {
        userId: user.id,
        channelId,
        bannedUntil: payload.bannedUntil,
      },
    });
    setTimeout(async () => {
      const channelBan = await this.prismaService.channelBan.findFirst({
        where: {
          userId: user.id,
          channelId,
        },
      });
      if (!channelBan) return;
      if (new Date(channelBan.bannedUntil) < new Date())
        await this.prismaService.channelBan.delete({
          where: { id: channelBan.id },
        });
    }, new Date(payload.bannedUntil).getTime() - new Date().getTime());
  }

  @SubscribeMessage("unbanChannelUser")
  async unbanChannelUser(client: Socket, payload: UnbanChannelUserDto) {
    await this.prismaService.channelBan.delete({ where: { id: payload.id } });
    this.server.to(payload.channelId).emit("updateChannels", false);
  }

  @SubscribeMessage("join")
  join(client: Socket, channelId: string): void {
    client.join(channelId);
  }

  @SubscribeMessage("leave")
  leave(client: Socket, channelId: string): void {
    client.leave(channelId);
  }

  @SubscribeMessage("delete")
  async delete(client: Socket, payload: DeleteChannelDto) {
    const channel = await this.channelsService.findOneWithOwner(payload.channelId);
    if (!channel) return "This channel does not exist.";
    if (channel.users.some((user) => user.userId !== payload.userId)) return "You are not channel's owner.";
    await this.ChannelUsersService.deleteAllFromChannel(payload.channelId);
    await this.prismaService.channelBan.deleteMany({ where: { channelId: payload.channelId } });
    await this.messagesService.deleteAll(payload.channelId);
    await this.channelsService.delete(payload.channelId);
    this.server.to(payload.channelId).emit("updateChannels", true);
  }

  @SubscribeMessage("quit")
  async quit(client: Socket, payload: DeleteChannelDto) {
    client.leave(payload.channelId);
    const channel = await this.channelsService.findOne(payload.channelId);
    const channelUser = await this.ChannelUsersService.findFirst({
      userId: payload.userId,
      channelId: payload.channelId,
    });
    await this.ChannelUsersService.deleteUser({
      userId: payload.userId,
      channelId: payload.channelId,
    });
    if (!channelUser) return "This user is not on this channel.";
    if (channel.type !== "PROTECTED" || channelUser.isAuthorized) {
      const user = await this.userService.findOneById(payload.userId);
      if (!user) return "This user does not exist";
      this.handleMessage(client, { content: `${user.name} left`, channelId: payload.channelId });
    }
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("message")
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    const channel = await this.channelsService.findOne(payload.channelId);
    if (!channel) return "Channel does not exist.";
    if (payload.senderId) {
      const sender = await this.userService.findOneById(payload.senderId);
      if (!sender) return "User does not exist.";
      const channelUser = await this.ChannelUsersService.findFirst({ userId: sender.id, channelId: channel.id });
      if (!channelUser || channelUser.isMuted || !channelUser.isAuthorized) return;
      const channelBan = await this.prismaService.channelBan.findFirst({
        where: { userId: sender.id, channelId: channel.id },
      });
      if (channelBan) return;
    }
    const message = await this.messagesService.create(payload);
    await this.channelsService.update({
      id: payload.channelId,
      lastMessage: message.createdAt,
    });
    this.server.to(payload.channelId).emit("message", message);
    this.server.to(payload.channelId).emit("updateChannels", false);
    return message;
  }

  @SubscribeMessage("block")
  async block(client: Socket, payload: BlockedUserDto) {
    const user = await this.userService.findOneById(payload.userId);
    if (!user) return;
    const blocked = await this.userService.findOneById(payload.blockedUserId);
    if (!blocked) return;
    if (payload.toBlock) {
      await this.blockedService.create(payload);
    } else {
      await this.blockedService.delete(payload);
    }
    client.emit("reloadUser");
  }

  @SubscribeMessage("disableInvitation")
  async disableInvitation(client: Socket, payload: DisableInvitationDto) {
    await this.messagesService.disableInvitation(payload.messageId);
    this.server.to(payload.channelId).emit("updateChannels", false);
  }
}
