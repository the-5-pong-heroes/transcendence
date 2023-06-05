import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  app.enableCors({
  //    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://api.intra.42.fr/*"],
  //    credentials: true,
  //  });import { APP_FILTER } from "@nestjs/core";

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:3333"],
    allowedHeaders: ["content-type"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.use(cookieParser());
  app.use(session({ secret: "secret-key" }));

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3333);
}

bootstrap();
