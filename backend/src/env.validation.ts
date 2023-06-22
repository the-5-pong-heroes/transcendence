import { plainToClass } from "class-transformer";
import { IsString, validateSync, IsNotEmpty, IsNumber } from "class-validator";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  POSTGRES_PORT: number;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsString()
  @IsNotEmpty()
  COOKIES_SECRET: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string;

  @IsString()
  @IsNotEmpty()
  GMAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  GMAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  API_42_ID: string;

  @IsString()
  @IsNotEmpty()
  API_42_SECRET: string;

  @IsString()
  @IsNotEmpty()
  IMG_BB_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
