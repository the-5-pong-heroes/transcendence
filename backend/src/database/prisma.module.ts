import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() // this Prisma service will be available to all the modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
