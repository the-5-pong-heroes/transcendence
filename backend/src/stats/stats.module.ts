import { Module } from "@nestjs/common";
import { MyProfileController, StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  controllers: [StatsController, MyProfileController],
  providers: [StatsService],
})
export class StatsModule {
  // helloworld() {}
}
