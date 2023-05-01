import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LEVELS, LEVEL_THRESHOLD } from "src/common/constants/others";
import { Friendship, GameStatus, User, UserStatus } from "@prisma/client";

interface UserData {
  [id: string]: {
    avatar: string;
    name: string;
    score: number;
    wins: number;
    defeats: number;
    level: string;
    status: string;
    // friend: boolean;
  };
}
interface MyData {
  id: string;
  avatar: string;
  name: string;
  score: number;
  nbGames: number;
  wins: number;
  defeats: number;
  level: string;
  status: string;
  friends: { name: string; id: string }[];
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
            status: true,
            avatar: true,
          },
        },
        playerOneScore: true,
        playerTwo: {
          select: {
            id: true,
            name: true,
            status: true,
            avatar: true,
          },
        },
        playerTwoScore: true,
      },
    });
  }

  getLevel(score: number): string {
    const level_number = Math.min(LEVELS.length - 1, Math.floor(score / LEVEL_THRESHOLD));
    return LEVELS[level_number];
  }

  async getStatsData() {
    const games = await this.getGames();
    const users: UserData = {};
    // initialization
    games.forEach((item) => {
      const userId1: string = item["playerOne"]["id"];
      const userId2: string = item["playerTwo"]?.id as string;
      if (!(userId1 in users))
        users[userId1] = {
          name: item["playerOne"]["name"] as string,
          score: 0,
          wins: 0,
          defeats: 0,
          level: "human",
          avatar: "",
          status: UserStatus.OFFLINE,
          // friend: 0,
        };
      if (!(userId2 in users))
        users[userId2] = {
          name: item["playerTwo"]?.name as string,
          score: 0,
          wins: 0,
          defeats: 0,
          level: "human",
          avatar: "",
          status: UserStatus.OFFLINE,
          // friend: 0,
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
      // updates the user status
      users[userId1]["status"] = item["playerOne"].status;
      users[userId2]["status"] = item["playerTwo"]?.status as string;
      // updates the avatar URL
      users[userId1]["avatar"] = item["playerOne"].avatar as string;
      users[userId2]["avatar"] = item["playerTwo"]?.avatar as string;
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

  async getUserData(currentuser: User) {
    // TEMPORAIRE
    const user = await this.prisma.user.findUnique({
      where: {
        // name: "John Doe",
        name: "Jane Smith",
      },
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    const games = await this.getGames();
    const myData: MyData = {
      id: user?.id as string,
      name: user?.name as string,
      score: 0,
      nbGames: 0,
      wins: 0,
      defeats: 0,
      level: "human",
      avatar: user?.avatar as string,
      status: user?.status as string,
      friends: user?.addedBy.map((item) => item.user) as { name: string; id: string }[],
    };
    games.forEach((game) => {
      if (user?.id === game["playerOne"]["id"] || user?.id === game["playerTwo"]?.id) {
        myData.nbGames += 1;
        const playerNb = user?.id === game["playerOne"]["id"] ? "One" : "Two";
        const opponentNb = user?.id === game["playerOne"]["id"] ? "Two" : "One";
        myData.score += game[`player${playerNb}Score`];
        if (game[`player${playerNb}Score`] > game[`player${opponentNb}Score`]) {
          myData.wins += 1;
        } else if (game[`player${playerNb}Score`] < game[`player${opponentNb}Score`]) {
          myData.defeats += 1;
        }
      }
    });
    myData.level = this.getLevel(myData.score);
    return { ...myData };
  }
}
