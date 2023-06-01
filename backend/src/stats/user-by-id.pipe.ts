import { PipeTransform, Injectable, NotFoundException, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {
  constructor(private prisma: PrismaService) {}

  async transform(myUuid: string, metadata: ArgumentMetadata): Promise<User> {
    if (myUuid === undefined || !myUuid) {
      console.log("🏆 myUuid", myUuid);
      throw new BadRequestException("User ID is required");
    }
    console.log("🎖️ myUuid", myUuid);
    const user: User | null = await this.prisma.user.findUnique({ where: { id: myUuid } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
