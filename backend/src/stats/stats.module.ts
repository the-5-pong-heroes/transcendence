import { Module } from "@nestjs/common";
import { MyProfileController, StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [StatsController, MyProfileController],
  imports: [AuthModule],
  providers: [StatsService],
})
export class StatsModule {
  // helloworld() {}
}
