import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../database/prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
