import { Module } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
