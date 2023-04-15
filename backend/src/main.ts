import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://api.intra.42.fr/*"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  app.use(session({ secret: 'secret-key' }));

  await app.listen(3333); // 3000 might be taken by React
}

bootstrap();
