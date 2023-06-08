import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
// import { CreateUserSettingDto } from "./dto/create-user-setting.dto";
import { UpdateUsernameDto } from "./dto/update-username.dto";
import { UserSettings } from "./user-settings.service";
import { CurrentUser } from "src/stats/current-user.decorator";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGuard } from "src/auth/user.guard";

@Controller("settings")
@UseGuards(UserGuard)
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

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userSettingsService.updateAvatar(user, file);
  }
}
