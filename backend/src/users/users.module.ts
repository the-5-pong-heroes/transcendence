import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "../database/prisma.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, PrismaService, UserGuard],
  exports: [UserService],
})
export class UsersModule {}
