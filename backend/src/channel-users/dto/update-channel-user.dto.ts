import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsIn } from "class-validator";
import { Role } from "@prisma/client";

const roles = ["USER", "ADMIN", "OWNER"] as const;

export class UpdateChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsIn(roles)
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isMuted?: boolean;

  @IsString()
  @IsOptional()
  mutedUntil?: string;

  @IsBoolean()
  @IsOptional()
  isAuthorized?: boolean;
}
