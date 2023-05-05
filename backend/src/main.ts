import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }),
  );

  app.use(session({ secret: 'secret-key' }));
  app.use(cookieParser());

  await app.listen(3333); // 3000 might be taken by React
}
bootstrap();
