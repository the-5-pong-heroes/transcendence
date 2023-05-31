import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
// import { CreateUserSettingDto } from "./dto/create-user-setting.dto";
import { UpdateUsernameDto } from "./dto/update-username.dto";
import { UserSettings } from "./user-settings.service";
import { CurrentUser } from "src/stats/current-user.decorator";
import { User } from "@prisma/client";

@Controller("settings")
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  async getUserSettings(@CurrentUser() user: User) {
    //: Promise<UserSettings>
    return this.userSettingsService.getUserSettings(user);
  }

  @Patch()
  create(@CurrentUser() user: User, @Body() updateDto: UpdateUsernameDto) {
    return this.userSettingsService.updateUsername(user, updateDto.name);
  }
}
