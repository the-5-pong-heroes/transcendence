import { Module } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { AuthModule } from "src/auth/auth.module";
import { UserGuard } from "src/auth/user.guard";

@Module({
  imports: [AuthModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, UserGuard],
})
export class UserSettingsModule {}
