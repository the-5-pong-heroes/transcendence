import { Controller, Get, Redirect, Param, UseGuards } from "@nestjs/common";
import { GameData, StatsService, UserStats } from "./stats.service";
import { User } from "@prisma/client";
import { CurrentUser } from "./current-user.decorator";
import { UserByIdPipe } from "./user-by-id.pipe";
import { StatsGuard } from "./guard";

@Controller("leaderboard")
@UseGuards(StatsGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStatsData(@CurrentUser() user: User): Promise<UserStats[]> {
    console.log("🧄", user);
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
    return { url: `/profile/${user?.id}` };
  }

  @Get("history")
  @UseGuards(StatsGuard)
  @Redirect("/")
  redirectToHistory(@CurrentUser() user: User) {
    return { url: `/profile/history/${user?.id}` };
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
