import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
// import { CreateUserSettingDto } from "./dto/create-user-setting.dto";
// import { UpdateUserSettingDto } from "./dto/update-user-setting.dto";
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

  // @Patch()
  // create(@Body() createUserDto: UpdateUsernameDto) {
  //   return "This action adds a new user";
  // }
}
