import { BadGatewayException } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Message } from "@prisma/client";
import { Socket, Server } from "socket.io";
import { ChannelUsersService } from "../channel-users/channel-users.service";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "../users/users.service";
import { CreateMessageDto } from "../messages/dto/create-message.dto";
import { MessagesService } from "../messages/messages.service";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChannelsGateway {
  constructor(
    private prismaService: PrismaService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private channelUsersService: ChannelUsersService,
    private usersService: UserService,
  ) {}

  @WebSocketServer() server!: Server;

  @SubscribeMessage("create")
  async create(client: Socket, payload: CreateChannelDto) {
    if (payload.name === "") return "Channel must have name.";
    const user = await this.usersService.findOneById(payload.users.userId);
    if (!user) return "User does not exist";
    const channel = await this.channelsService.create(payload);
    await this.messagesService.create({
      content: `${user.name} created the channel`,
      channelId: channel.id,
    });
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("wantJoin")
  async wantJoin(client: Socket, payload: any) {
    const channel = await this.channelsService.findOne(payload.channelId);
    const banChannel = await this.prismaService.channelBan.findFirst({
      where: {
        channelId: payload.channelId,
        userId: payload.userId,
      },
    });
    if (banChannel) return;
    if (channel.type === "PROTECTED") payload = { ...payload, isAuthorized: false };
    await this.channelsService.addUser(payload);
    if (channel.type !== "PROTECTED") return this.confirmJoin(client, payload);
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("confirmJoin")
  async confirmJoin(client: Socket, payload: any) {
    const user = await this.usersService.findOneById(payload.userId);
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
    const channelUser = await this.prismaService.channelUser.findFirst({
      where: {
        channelId: payload.channelId,
        userId: payload.userId,
      },
    });
    if (!channelUser) return "This user is not on this channel.";
    await this.prismaService.channelUser.update({
      where: {
        id: channelUser.id,
      },
      data: {
        isAuthorized: true,
      },
    });
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
    const channelUser = await this.channelUsersService.update(payload);
    const user = await this.usersService.findOneById(channelUser.userId);
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
          const newChannelUser = await this.channelUsersService.findOne(payload.id);
          if (!newChannelUser) return;
          if (new Date(newChannelUser.mutedUntil) < new Date() && newChannelUser.isMuted) {
            await this.channelUsersService.update({
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
    const { user, channelId } = await this.channelUsersService.findUser(payload.id);
    await this.channelUsersService.delete(payload.id);
    this.handleMessage(client, {
      content: `${user.name} has been kicked`,
      channelId: channelId,
    });
  }

  @SubscribeMessage("banChannelUser")
  async banChannelUser(client: Socket, payload: any) {
    const { user, channelId } = await this.channelUsersService.findUser(payload.id);
    await this.channelUsersService.delete(payload.id);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Paris",
    };
    this.handleMessage(client, {
      content: `${user.name} has been banned until ${new Date(payload.bannedUntil).toLocaleDateString("fr-FR", options)}`,
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
    const deleteChanUser = this.prismaService.channelUser.deleteMany({
      where: { channelId: payload.channelId },
    });
    const deleteMessages = this.messagesService.deleteAll(payload.channelId);
    const deleteChannel = this.channelsService.delete(payload.channelId);
    await this.prismaService.$transaction([deleteChanUser, deleteMessages, deleteChannel]);
    this.server.to(payload.channelId).emit("updateChannels", true);
  }

  @SubscribeMessage("quit")
  async quit(client: Socket, payload: any) {
    client.leave(payload.channelId);
    const channel = await this.channelsService.findOne(payload.channelId);
    const channelUser = await this.prismaService.channelUser.findFirst({
      where: {
        userId: payload.userId,
        channelId: payload.channelId,
      },
    });
    await this.prismaService.channelUser.deleteMany({
      where: {
        userId: payload.userId,
        channelId: payload.channelId,
      },
    });
    if (!channelUser) return "This user is not on this channel.";
    if (channel.type !== "PROTECTED" || channelUser.isAuthorized) {
      const user = await this.usersService.findOneById(payload.userId);
      if (!user) return "This user does not exist";
      this.handleMessage(client, { content: `${user.name} left`, channelId: payload.channelId });
    }
    client.emit("updateChannels", true);
  }

  @SubscribeMessage("message")
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    const sender = await this.usersService.findOneById(payload.senderId);
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
}
