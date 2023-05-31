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
    let updateUser;
    try {
      updateUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { name: username },
      });
    } catch (error) {
      throw new ConflictException("Username already taken!");
    }
    return updateUser;
  }

  async updateAvatar(user: User, avatar: Express.Multer.File) {
    const formData = new FormData();
    formData.append("image", avatar.buffer.toString("base64"));
    const { data: imageData } = await firstValueFrom(
      this.httpService
        .post(`https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMG_API_KEY}`, formData)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    user.updateOne({ avatar: imageData.data.url }).exec();
  }
}

/*
async updateUser(id: number, user: User): Promise<User> {
  if (!user) throw new HttpException('Body null', HttpStatus.NOT_FOUND);
  await this.getUser(id);

  const can: Array<string> = ['username', 'followed', 'blocked'];

  for (const key of Object.keys(user))
    if (can.indexOf(key) == -1)
      throw new HttpException(
        'Value cannot be modified',
        HttpStatus.FORBIDDEN,
      );

  if (user.username) {
    user.username = user.username.replace(/\s+/g, '');
    if (!user.username.length)
      throw new HttpException(
        'Username cannot be empty',
        HttpStatus.FORBIDDEN,
      );
  }

  try {
    user.id = id;
    if (user.username) user.profileCompleted = true;
    await this.userRepository.update(id, user);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  delete user.id;
  return user;
}
*/