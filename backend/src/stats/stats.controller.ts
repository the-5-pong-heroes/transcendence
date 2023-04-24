import { Body, Controller, Get, Post } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { PrismaService } from "src/database/prisma.service";

@Controller("stats")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get("world")
  helloworld() {
    /*
    We'll need:
    - some users
    - some games
    - some friends
    */
    return this.statsService.helloworld();
  }
}

@Controller("create")
export class CreationController {
  constructor(private prisma: PrismaService) {}

  @Get("user")
  async get_user() {
    const user = await this.prisma.user.findFirst({
      where: { name: "raoul" },
    });
    console.log(user);
    return user;
  }

  @Post("user")
  async create_user() {
    const user = await this.prisma.user.create({
      data: {
        name: "raoul",
        status: "OFFLINE",
        lastLogin: new Date(),
      },
    });
    return "✅ User created";
  }

  @Post("game")
  async create_game(@Body() body: any) {
    console.log(body);

    // const game = await this.prisma.game.create({
    //   data: {
    //     name: "raoul",
    //     status: "OFFLINE",
    //     lastLogin: new Date(),
    //   },
    // });
    return {};
  }
}

@Controller("delete")
export class DeletionController {
  constructor() {}

  @Post("user")
  helloworld() {
    return "❎ User deleted";
  }
}
