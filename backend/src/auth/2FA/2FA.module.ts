import { Module } from "@nestjs/common";
import { Generate2FAService } from "./generate.service";

@Module({
  providers: [Generate2FAService],
  exports: [Generate2FAService],
})
export class generate2FAModule {}