import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client";
import { CurrentUser } from "src/models/users/current-user.decorator";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStatsData(@CurrentUser("") user: User) {
    return this.statsService.getStatsData(user);
  }

  // @Get(":id")
  // getProfileData(@Param("id", ParseUUIDPipe) uuid: string) {
  //   return this.statsService.getUserData();
  // }
}

@Controller("profile")
export class MyProfileController {
  constructor(private statsService: StatsService) {}

  @Get()
  getUserData(@CurrentUser("") user: User) {
    return this.statsService.getUserData(user);
  }
}
