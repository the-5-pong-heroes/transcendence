import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable({})
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async orderByPoints() {
    let users: { [key: string]: { score: number; name: string } } = {};
    const games = await this.prisma.game.findMany({
      where: {
        status: "FINISHED",
      },
      select: {
        playerOne: {
          select: {
            id: true,
            name: true,
          },
        },
        playerOneScore: true,
        playerTwo: {
          select: {
            id: true,
            name: true,
          },
        },
        playerTwoScore: true,
      },
    });
    games.forEach((item) => {
      const userId1: string = item["playerOne"]["id"];
      const userName1: string = item["playerOne"]["name"];
      const score1: number = item["playerOneScore"];
      const userId2: string = item["playerTwo"]?.id as string;
      const userName2: string | undefined = item["playerTwo"]?.name as string;
      const score2: number = item["playerTwoScore"];
      if (!(userId1 in users))
        users[userId1] = { score: score1, name: userName1 };
      else users[userId1]["score"] += score1;
      if (!(userId2 in users))
        users[userId2] = { score: score2, name: userName2 };
      else users[userId2]["score"] += score2;
    });
    const users_arr: { id: string; name: string; score: number }[] =
      Object.keys(users).map((id) => {
        return { id: id, ...users[id] };
      });
    return users_arr.sort((userA, userB): number => userB.score - userA.score);
  }

  async orderByResults() {}
}
