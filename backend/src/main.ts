import { NestFactory, HttpAdapterHost } from "@nestjs/core";
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
