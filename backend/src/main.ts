import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }),
  );
  app.enableCors({
		origin: ['http://localhost:5173', 'http://localhost:3333'],
		allowedHeaders: ['content-type'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		preflightContinue: false,
		optionsSuccessStatus: 204,
		credentials: true,
	});
  app.use(cookieParser());
  app.use(session({ secret: 'secret-key' }));

  app.use(passport.initialize());
	app.use(passport.session());
  await app.listen(3333); // 3000 might be taken by React
}
bootstrap();
