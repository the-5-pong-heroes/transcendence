import { Role } from "@prisma/client";

export class UpdateChannelUserDto {
  id!: string;
  role?: Role;
  isMuted?: boolean;
  isAuthorized?: boolean;
}
