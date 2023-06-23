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
} from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
// import { CreateUserSettingDto } from "./dto/create-user-setting.dto";
import { UpdateUsernameDto } from "./dto/update-username.dto";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { MAX_FILE_SIZE, VALID_FILE_TYPES } from "src/common/constants/others";

@Controller("settings")
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  async getUserSettings(@CurrentUser() user: User) {
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
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: VALID_FILE_TYPES }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userSettingsService.updateAvatar(user, file);
  }
}
