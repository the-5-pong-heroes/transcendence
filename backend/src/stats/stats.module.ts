import { Module } from "@nestjs/common";
import {
  StatsController,
  CreationController,
  DeletionController,
} from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  controllers: [StatsController, CreationController, DeletionController],
  providers: [StatsService],
})
export class StatsModule {
  // helloworld() {}
}
