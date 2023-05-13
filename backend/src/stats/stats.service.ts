import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LEVELS, LEVEL_THRESHOLD } from "src/common/constants/others";
import { GameStatus, User } from "@prisma/client";

interface GameData {
  playerOne: { id: string };
  playerOneScore: number;
  playerTwo: { id: string };
  playerTwoScore: number;
}

export interface GamesStats {
  [id: string]: {
    score: number;
    wins: number;
    defeats: number;
    rank: number;
  };
}

interface UserData {
  id: string;
  name: string;
  avatar: null | string;
  status: string;
  lastLogin: null | Date;
  createdAt: Date;
  updatedAt: Date;
  addedBy: { user: { name: string; id: string } }[];
}

export interface UserStats {
  id: string;
  name: string;
  avatar: string | null;
  status: string;
  lastLogin: null | Date;
  createdAt: Date;
  updatedAt: Date;
  rank: number;
  score: number;
  wins: number;
  defeats: number;
  friends: { name: string; id: string }[];
  level: string;
  isFriend: boolean;
  isMe: boolean;
}

@Injectable({})
export class StatsService {
  constructor(private prisma: PrismaService) {}

  getLevel(score: number): string {
    const level_number = Math.min(LEVELS.length - 1, Math.floor(score / LEVEL_THRESHOLD));
    return LEVELS[level_number];
  }

  isFriend(friends: { name: string; id: string }[], userId: string): boolean {
    return friends.map((item: any) => item.id).includes(userId);
  }

  async extractGamesData(): Promise<GameData[]> {
    const rawData = await this.prisma.game.findMany({
      where: { status: GameStatus.FINISHED },
      select: {
        playerOne: { select: { id: true } },
        playerOneScore: true,
        playerTwo: { select: { id: true } },
        playerTwoScore: true,
      },
    });
    return rawData as GameData[];
  }

  async getGamesStats(): Promise<GamesStats> {
    const gamesStats: GamesStats = {};
    const rawData = await this.extractGamesData();
    rawData.forEach((game) => {
      const { playerOne, playerOneScore, playerTwo, playerTwoScore } = game;
      const playerOneData = gamesStats[playerOne.id] || { rank: 0, score: 0, wins: 0, defeats: 0 };
      const playerTwoData = gamesStats[playerTwo.id] || { rank: 0, score: 0, wins: 0, defeats: 0 };
      playerOneData.score += playerOneScore;
      playerTwoData.score += playerTwoScore;
      if (playerOneScore > playerTwoScore) {
        playerOneData.wins += 1;
        playerTwoData.defeats += 1;
      } else {
        playerTwoData.wins += 1;
        playerOneData.defeats += 1;
      }
      gamesStats[playerOne.id] = playerOneData;
      gamesStats[playerTwo.id] = playerTwoData;
    });
    const ranks = Object.keys(gamesStats).sort((a, b) => {
      return gamesStats[b].score - gamesStats[a].score;
    });
    let previousId = "";
    ranks.forEach((userId) => {
      if (!previousId) {
        gamesStats[userId].rank = 1;
      } else if (gamesStats[userId].score === gamesStats[previousId].score) {
        gamesStats[userId].rank = gamesStats[previousId].rank;
      } else {
        gamesStats[userId].rank = gamesStats[previousId].rank + 1;
      }
      previousId = userId;
    });
    return gamesStats;
  }

  async extractUserData(myUserId: string, userId: string): Promise<UserStats> {
    const { addedBy, ...data } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    const friends: { name: string; id: string }[] = [];
    addedBy.forEach((friend) => {
      friends.push({ name: friend.user.name, id: friend.user.id });
    });
    const otherInfo = {
      rank: 1,
      score: 0,
      wins: 0,
      defeats: 0,
      level: "",
      isMe: myUserId === userId,
      isFriend: this.isFriend(friends, userId),
    };
    return { ...data, friends, ...otherInfo };
  }

  addGamesStatsToUser(user: UserStats, games: GamesStats): UserStats {
    if (user.id in games) {
      user.rank = games[user.id].rank;
      user.score = games[user.id].score;
      user.wins = games[user.id].wins;
      user.defeats = games[user.id].defeats;
    } else if (Object.keys(games).length) {
      const {
        score: lowestScore,
        rank: maxRank,
        ...rest
      } = Object.values(games).sort((a, b) => {
        return a.score - b.score;
      })[0];
      user.rank = lowestScore === 0 ? maxRank : maxRank + 1;
    }
    user.level = this.getLevel(user.score);
    return user;
  }

  async getUserStats(currentUser: User, targetUser: User): Promise<UserStats> {
    const user = await this.extractUserData(currentUser.id, targetUser.id);
    const games = await this.getGamesStats();
    return this.addGamesStatsToUser(user, games);
  }

  async extractUsersData(): Promise<UserData[]> {
    const rawData = await this.prisma.user.findMany({
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    return rawData;
  }

  async getUsersStats(currentUser: User): Promise<UserStats[]> {
    const myUserId = currentUser.id;
    const rawData = await this.extractUsersData();
    const games = await this.getGamesStats();
    const users: UserStats[] = rawData.map((userRawData) => {
      const { addedBy, ...rest } = userRawData;
      const friends: { name: string; id: string }[] = [];
      addedBy.forEach((friend) => {
        friends.push({ name: friend.user.name, id: friend.user.id });
      });
      const otherInfo = {
        rank: 1,
        score: 0,
        wins: 0,
        defeats: 0,
        level: "",
        isMe: userRawData.id === myUserId,
        isFriend: this.isFriend(friends, myUserId),
      };
      const user = { ...rest, friends, ...otherInfo };
      return this.addGamesStatsToUser(user, games);
    });
    return users;
  }
}
