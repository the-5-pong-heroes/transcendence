import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ALLOWED_ORIGINS } from "./common/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser()); // cookie parser middleware

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}

bootstrap();
