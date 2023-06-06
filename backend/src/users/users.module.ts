import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "../database/prisma.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [UsersController],
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersService, PrismaService, UserGuard],
  exports: [UsersService],
})
export class UsersModule {}
