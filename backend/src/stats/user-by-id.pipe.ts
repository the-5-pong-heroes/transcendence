import { PipeTransform, Injectable, NotFoundException, ArgumentMetadata } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {
  constructor(private prisma: PrismaService) {}

  async transform(myUuid: string, metadata: ArgumentMetadata): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: myUuid } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
