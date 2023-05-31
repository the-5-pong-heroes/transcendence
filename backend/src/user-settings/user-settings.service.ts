import { ConflictException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
// import { CreateUserSettingDto } from "./dto/create-user-setting.dto";
// import { UpdateUserSettingDto } from "./dto/update-user-setting.dto";

export interface UserSettings {
  id: string;
  name: string;
  avatar: string | null;
  friends: { id: string; name: string }[];
  // 2FA
}

@Injectable()
export class UserSettingsService {
  constructor(private prisma: PrismaService) {}

  async getUserSettings(user: User) {
    // : Promise<UserSettings>
    // name actuel
    // avatar actuel
    // amis actuels
    // 2FA actuellement activé ou non ?
    const { addedBy, ...data } = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        avatar: true,
        addedBy: { select: { user: { select: { name: true, id: true } } } },
      },
    });
    const friends: { name: string; id: string }[] = [];
    addedBy.forEach((friend) => {
      friends.push({ name: friend.user.name, id: friend.user.id });
    });
    return { ...data, friends };
  }

  async updateUsername(user: User, username: string) {
    let updatedUser;
    try {
      updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { name: username },
      });
    } catch (error) {
      throw new ConflictException("Username already taken!");
    }
    return updatedUser;
  }

  async updateAvatar(user: User, avatar: Express.Multer.File) {
    const formData = new FormData();
    formData.append("image", avatar.buffer.toString("base64"));
    let data;
    try {
      const url = "https://api.imgbb.com/1/upload?key=135105238adbeae913034e9d697c8e96";
      const resp = await fetch(url, { method: "POST", body: formData });
      data = await resp.json();
    } catch (err) {
      throw err;
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { avatar: data.data.url },
    });
    return updatedUser;
  }
}
