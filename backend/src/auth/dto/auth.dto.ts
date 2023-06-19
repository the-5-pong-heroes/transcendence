import { IsString, IsBoolean, IsOptional } from "class-validator";

export class UserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isRegistered?: boolean;
}

export class FindOneParams {
  @IsString()
  @IsOptional()
  name?: string;
}
