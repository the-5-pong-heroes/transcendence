import { Controller, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Post("helloworld")
  helloworld() {
    return "Bonjour monde!";
  }
}
