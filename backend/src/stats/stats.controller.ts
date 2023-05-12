import { Controller, Get } from "@nestjs/common";
import { StatsService, UserData } from "./stats.service";
import { User } from "@prisma/client";
import { CurrentUser } from "src/models/users/current-user.decorator";

@Controller("leaderboard")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStatsData(@CurrentUser("") user: User): Promise<UserData> {
    return this.statsService.getUserStats(user); // FIXME
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
    return this.statsService.getUserStats(user);
  }

  // @Get(":uuid")

  /*
  monsite.fr/profile/011500e7-4c91-4f97-b41f-d2678a8e773e
  monsite.fr/profile/43209837-4c91-4f97-b41f-d2678a8e773e
  monsite.fr/profile/99999999-4c91-4f97-b41f-d2678a8e773e
  -> redirection vers monsite.fr/myprofile
  */
}
