import { Controller, Get } from "@nestjs/common";
import { StatsService, UserStats } from "./stats.service";
import { User } from "@prisma/client";
import { CurrentUser } from "./current-user.decorator";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStatsData(@CurrentUser() user: User): Promise<UserStats[]> {
    return this.statsService.getUsersStats(user);
  }
}

@Controller("profile")
export class MyProfileController {
  constructor(private statsService: StatsService) {}

  @Get() // TODO ":uuid"
  getUserData(@CurrentUser() user: User) {
    return this.statsService.getUserStats(user, user);
  }

  // @Get(":uuid")
  /*
  monsite.fr/profile/011500e7-4c91-4f97-b41f-d2678a8e773e
  monsite.fr/profile/43209837-4c91-4f97-b41f-d2678a8e773e
  monsite.fr/profile/99999999-4c91-4f97-b41f-d2678a8e773e
  -> redirection vers monsite.fr/myprofile
  */

  /*
  TODO ordre du leaderboard
  TODO nbGames
  */
}
