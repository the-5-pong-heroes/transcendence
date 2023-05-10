import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LEVELS, LEVEL_THRESHOLD } from "src/common/constants/others";
import { GameStatus, User, UserStatus } from "@prisma/client";

interface UserData {
  [id: string]: {
    avatar: string;
    name: string;
    score: number;
    wins: number;
    defeats: number;
    level: string;
    status: string;
    friend: boolean;
    isMe: boolean;
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

  async getFriends(user_id: string) {
    const data = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    return data;
  }

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

  isFriend(friendships: any, user_id: string) {
    return friendships.map((item: any) => item.user.id).includes(user_id);
  }

  async getStatsData(currentUser: User) {
    const games = await this.getGames();
    const users: UserData = {};
    // initialization
    const myId = "4e0e94c6-f526-4346-b2f5-b51c7ea9ba5c"; // TODO currentUser.id
    const friendships = (await this.getFriends(myId))?.addedBy;
    games.forEach((item) => {
      const userId1: string = item["playerOne"]["id"];
      const userId2: string = item["playerTwo"]?.id as string;
      if (!(userId1 in users))
        users[userId1] = {
          name: item["playerOne"]["name"] as string,
          score: 0,
          wins: 0,
          defeats: 0,
          level: LEVELS[0],
          avatar: "",
          status: UserStatus.OFFLINE,
          friend: this.isFriend(friendships, userId1),
          isMe: userId1 == myId,
        };
      if (!(userId2 in users))
        users[userId2] = {
          name: item["playerTwo"]?.name as string,
          score: 0,
          wins: 0,
          defeats: 0,
          level: LEVELS[0],
          avatar: "",
          status: UserStatus.OFFLINE,
          friend: this.isFriend(friendships, userId2),
          isMe: userId2 == myId,
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
    const output = Object.keys(users)
      .map((id: string) => {
        return { id: id, ...users[id] };
      })
      .sort((userA, userB): number => userB.score - userA.score);
    return output;
  }

  async getUserData(currentUser: User) {
    // TEMPORAIRE
    const user = await this.getFriends("bb7d87d5-dba5-4461-b462-e577a210e827");
    const games = await this.getGames();
    const myData: MyData = {
      id: user?.id as string,
      name: user?.name as string,
      score: 0,
      nbGames: 0,
      wins: 0,
      defeats: 0,
      level: LEVELS[0],
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
