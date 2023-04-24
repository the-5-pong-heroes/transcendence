import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LEVELS, LEVEL_THRESHOLD } from "src/common/constants/others";
import { GameStatus } from "@prisma/client";

interface UserData {
  [id: string]: {
    name: string;
    score: number;
    wins: number;
    defeats: number;
    level: string;
  };
}

@Injectable({})
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getGames() {
    return await this.prisma.game.findMany({
      where: {
        status: GameStatus.FINISHED,
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
  }

  getLevel(score: number): string {
    const level_number = Math.min(
      LEVELS.length - 1,
      Math.floor(score / LEVEL_THRESHOLD),
    );
    return LEVELS[level_number];
  }

  async getUserData() {
    const games = await this.getGames();
    let users: UserData = {};
    // initialization
    games.forEach((item) => {
      const userId1: string = item["playerOne"]["id"];
      const userId2: string = item["playerTwo"]?.id as string;
      if (!(userId1 in users))
        users[userId1] = {
          name: item["playerOne"]["name"],
          score: 0,
          wins: 0,
          defeats: 0,
          level: "human",
        };
      if (!(userId2 in users))
        users[userId2] = {
          name: item["playerTwo"]?.id as string,
          score: 0,
          wins: 0,
          defeats: 0,
          level: "human",
        };
    });
    games.forEach((item) => {
      const userId1: string = item["playerOne"]["id"];
      const score1: number = item["playerOneScore"];
      const userId2: string = item["playerTwo"]?.id as string;
      const score2: number = item["playerTwoScore"];
      // updates the number of victories & defeats of each user
      users[score1 > score2 ? userId1 : userId2]["wins"] += 1;
      users[score1 > score2 ? userId2 : userId1]["defeats"] += 1;
      // updates the score of each user
      users[userId1]["score"] += score1;
      users[userId2]["score"] += score2;
    });
    // updates the user level
    Object.keys(users).forEach((user_id: string) => {
      users[user_id]["level"] = this.getLevel(users[user_id]["score"]);
    });
    // by default, we sort the users by their score
    return Object.keys(users)
      .map((id) => {
        return { id: id, ...users[id] };
      })
      .sort((userA, userB): number => userB.score - userA.score);
  }
}
