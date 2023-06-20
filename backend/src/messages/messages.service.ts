import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateMessageDto): Promise<Message> {
    return this.prismaService.message.create({
      data,
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findAll(channelId: string): Promise<Message[]> {
    return this.prismaService.message.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  disableInvitation(messageId: string): Promise<Message> {
    console.log(messageId);
    return this.prismaService.message.update({
      where: { id: messageId },
      data: { content: "/InviteToPlayDisabled" },
    });
  }

  deleteAll(channelId: string) {
    return this.prismaService.message.deleteMany({ where: { channelId } });
  }
}
