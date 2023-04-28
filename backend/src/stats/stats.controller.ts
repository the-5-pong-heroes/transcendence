import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { PrismaService } from "src/database/prisma.service";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStatsData() {
    return this.statsService.getStatsData();
  }

  @Get(":id")
  getProfileData(@Param("id", ParseUUIDPipe) uuid: string) {
    return this.statsService.getUserData();
  }
}

@Controller("profile")
export class MyProfileController {
  constructor(private statsService: StatsService) {}

  @Get()
  getUserData() {
    return this.statsService.getUserData();
  }
}
