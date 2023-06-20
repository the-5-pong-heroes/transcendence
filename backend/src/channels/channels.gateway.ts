import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UseInterceptors } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ChannelUsersService } from "../channel-users/channel-users.service";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "../user/user.service";
import { CreateMessageDto } from "../messages/dto/create-message.dto";
import { MessagesService } from "../messages/messages.service";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
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
    private channeluserService: ChannelUsersService,
    private userService: UserService,
    private blockedService: BlockedService,
  ) {}

  @WebSocketServer() server!: Server;

  @SubscribeMessage("create")
  async create(client: Socket, payload: CreateChannelDto) {
    if (payload.name === "") return "Channel must have name.";
    const user = await this.userService.findOneById(payload.users.userId);
    if (!user) return "User does not exist";
    const channel = await this.channelsService.create(payload);
    await this.messagesService.create({
      content: `${user.name} created the channel`,
      channelId: channel.id,
    });
    client.emit("updateChannels", true);
  }

  async createDirectChannel(client: Socket, payload: any) {
    const user = await this.userService.findOneById(payload.channelId);
    if (!user) return "User does not exist";
    payload.type = "DIRECT";
    const channel = await this.channelsService.createDirect(payload);
    await this.ChannelusersService.create({
      channelId: channel.id,
      userId: payload.userId,
    });
    await this.ChannelusersService.create({
      channelId: channel.id,
      userId: payload.channelId,
    });
    this.server.emit("updateChannels", false);
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("wantJoin")
  async wantJoin(client: Socket, payload: any) {
    if (payload.type === undefined) return this.createDirectChannel(client, payload);
    const channel = await this.channelsService.findOne(payload.channelId);
    const banChannel = await this.prismaService.channelBan.findFirst({
      where: {
        channelId: payload.channelId,
        userId: payload.userId,
      },
    });
    if (banChannel) return;
    let { type: _, ...channelUser } = payload;
    if (channel.type === "PROTECTED") channelUser = { ...channelUser, isAuthorized: false };
    await this.ChannelusersService.create(channelUser);
    if (channel.type !== "PROTECTED") return this.confirmJoin(client, payload);
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("confirmJoin")
  async confirmJoin(client: Socket, payload: any) {
    const user = await this.userService.findOneById(payload.userId);
    if (!user) return "This user does not exist.";
    this.handleMessage(client, {
      content: `${user.name} joined`,
      channelId: payload.channelId,
    });
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("submitPassword")
  async submitPassword(client: Socket, payload: any) {
    const channel = await this.channelsService.findOne(payload.channelId);
    if (!channel) return "Channel does not exist.";
    if (channel.password !== payload.password) return "Password does not match.";
    const channelUser = await this.ChannelusersService.findFirst({
      channelId: payload.channelId,
      userId: payload.userId,
    });
    if (!channelUser) return "This user is not on this channel.";
    await this.ChannelusersService.update({ id: channelUser.id, isAuthorized: true });
    this.confirmJoin(client, payload);
  }

  @SubscribeMessage("updateChannelType")
  async updateChannelType(client: Socket, payload: any) {
    const channel = await this.channelsService.update(payload);
    this.handleMessage(client, {
      content: `Channel mode is now ${channel.type}`,
      channelId: channel.id,
    });
    if (channel.type === "PROTECTED")
      this.handleMessage(client, {
        content: `Channel password is now "${channel.password}"`,
        channelId: channel.id,
      });
  }

  @SubscribeMessage("updateChannelUser")
  async updateChannelUser(client: Socket, payload: any) {
    const channelUser = await this.ChannelusersService.update(payload);
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
          channelUser.isMuted
            ? `mute until ${new Date(payload.mutedUntil).toLocaleDateString("fr-FR", options)}`
            : "unmute"
        }`,
        channelId: channelUser.channelId,
      });
      if (payload.isMuted) {
        setTimeout(async () => {
          const newChannelUser = await this.ChannelusersService.findOne(payload.id);
          if (!newChannelUser || !newChannelUser.mutedUntil) return;
          if (new Date(newChannelUser.mutedUntil) < new Date() && newChannelUser.isMuted) {
            await this.ChannelusersService.update({
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
  async kickChannelUser(client: Socket, payload: any) {
    const { user, channelId } = await this.ChannelusersService.findUser(payload.id);
    await this.ChannelusersService.delete(payload.id);
    this.handleMessage(client, {
      content: `${user.name} has been kicked`,
      channelId: channelId,
    });
  }

  @SubscribeMessage("banChannelUser")
  async banChannelUser(client: Socket, payload: any) {
    const { user, channelId } = await this.ChannelusersService.findUser(payload.id);
    await this.ChannelusersService.delete(payload.id);
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
  async unbanChannelUser(client: Socket, payload: any) {
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
  async delete(client: Socket, payload: any) {
    const channel = await this.channelsService.findOneWithOwner(payload.channelId);
    if (!channel) return "This channel does not exist.";
    if (channel.users.some((user) => user.userId !== payload.userId)) return "You are not channel's owner.";
    await this.ChannelusersService.deleteAllFromChannel(payload.channelId);
    await this.prismaService.channelBan.deleteMany({ where: { channelId: payload.channelId } });
    await this.messagesService.deleteAll(payload.channelId);
    await this.channelsService.delete(payload.channelId);
    this.server.to(payload.channelId).emit("updateChannels", true);
  }

  @SubscribeMessage("quit")
  async quit(client: Socket, payload: any) {
    client.leave(payload.channelId);
    const channel = await this.channelsService.findOne(payload.channelId);
    const channelUser = await this.ChannelusersService.findFirst({
      userId: payload.userId,
      channelId: payload.channelId,
    });
    await this.ChannelusersService.deleteUser({
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
    const sender = await this.userService.findOneById(payload.senderId);
    if (payload.senderId && !sender) return "User does not exist.";
    const channel = await this.channelsService.findOne(payload.channelId);
    if (!channel) return "Channel does not exist.";
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
  async block(client: Socket, payload: any) {
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
}
