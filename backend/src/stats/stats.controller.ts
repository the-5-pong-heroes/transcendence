import { Body, Controller, Get, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { PrismaService } from "src/database/prisma.service";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get("points")
  orderByPoints() {
    return this.statsService.orderByPoints();
  }

  @Get("games")
  orderByResults() {
    return this.statsService.orderByResults();
  }
}
