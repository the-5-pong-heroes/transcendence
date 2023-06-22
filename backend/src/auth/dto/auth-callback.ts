import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class AuthCallbackDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  error: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  error_description: string;
}
