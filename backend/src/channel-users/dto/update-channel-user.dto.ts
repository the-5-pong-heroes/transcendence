import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsIn } from "class-validator";

const roles = ["USER", "ADMIN", "OWNER"] as const;

export class UpdateChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsIn(roles)
  role?: Role;

  @IsBoolean()
  isMuted?: boolean;

  @IsBoolean()
  isAuthorized?: boolean;
}
