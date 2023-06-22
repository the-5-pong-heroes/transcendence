import { IsString, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class UpdateChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
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
