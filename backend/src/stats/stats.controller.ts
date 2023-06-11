import { Controller, Get, Redirect, Param } from "@nestjs/common";
import { GameData, StatsService, UserStats } from "./stats.service";
import { User } from "@prisma/client";
import { CurrentUser } from "src/common/decorators";
import { UserByIdPipe } from "./user-by-id.pipe";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStatsData(@CurrentUser() user: User): Promise<UserStats[]> {
    return this.statsService.getUsersStats(user);
  }
}

@Controller("profile")
export class MyProfileController {
  constructor(private statsService: StatsService) {}

  @Get("")
  @Redirect("/")
  redirectToProfile(@CurrentUser() user: User) {
    // the "/profile" route redirects the user its profile
    return { url: `/profile/${user.id}` };
  }

  @Get("history")
  @Redirect("/")
  redirectToHistory(@CurrentUser() user: User) {
    return { url: `/profile/history/${user.id}` };
  }

  @Get(":uuid")
  getUserData(@CurrentUser() user: User, @Param("uuid", UserByIdPipe) targetUser: User): Promise<UserStats> {
    return this.statsService.getUserStats(user, targetUser);
  }

  @Get("history/:uuid")
  getHistory(@CurrentUser() myUser: User, @Param("uuid", UserByIdPipe) targetUser: User): Promise<GameData[]> {
    return this.statsService.getHistory(myUser, targetUser);
  }
}
