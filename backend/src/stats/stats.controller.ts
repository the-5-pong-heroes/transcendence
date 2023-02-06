import { Controller, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("hello")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Post("world")
  helloworld() {
    return this.statsService.helloworld();
  }
}
