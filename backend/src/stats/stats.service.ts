import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LEVELS, LEVEL_THRESHOLD } from "src/common/constants/others";
import { GameStatus, User } from "@prisma/client";

export interface GameData {
  playerOne: { id: string; name: string };
  playerOneScore: number;
  playerTwo: { id: string; name: string };
  playerTwoScore: number;
}

export interface GamesStats {
  [id: string]: {
    score: number;
    wins: number;
    defeats: number;
    rank: number;
    nbGames: number;
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
  nbGames: number;
  friends: { name: string; id: string }[];
  level: string;
  isFriend: boolean;
  isMe: boolean;
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // ############################### DB queries ###############################

  private async extractGamesData(): Promise<GameData[]> {
    const rawData = await this.prisma.game.findMany({
      where: { status: GameStatus.FINISHED },
      select: {
        playerOne: { select: { id: true, name: true } },
        playerOneScore: true,
        playerTwo: { select: { id: true, name: true } },
        playerTwoScore: true,
      },
    });
    return rawData as GameData[];
  }

  private async extractUsersData(): Promise<UserData[]> {
    const rawData = await this.prisma.user.findMany({
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    return rawData;
  }

  private async getUserFriends(uuid: string): Promise<{ name: string; id: string }[]> {
    const rawData = await this.prisma.user.findUniqueOrThrow({
      where: { id: uuid },
      select: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    const friends: { name: string; id: string }[] = [];
    rawData["addedBy"].forEach((friend) => {
      friends.push({ name: friend.user.name, id: friend.user.id });
    });
    return friends;
  }

  private async extractUserData(currentUser: User, userId: string): Promise<UserStats> {
    const { addedBy, ...data } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { addedBy: { select: { user: { select: { name: true, id: true } } } } },
    });
    const friends: { name: string; id: string }[] = [];
    addedBy.forEach((friend) => {
      friends.push({ name: friend.user.name, id: friend.user.id });
    });
    const currentUserFriends = await this.getUserFriends(currentUser?.id);
    const otherInfo = {
      rank: 1,
      score: 0,
      wins: 0,
      defeats: 0,
      nbGames: 0,
      level: "",
      isMe: currentUser?.id === userId,
      isFriend: this.isFriend(currentUserFriends, userId),
    };
    return { ...data, friends, ...otherInfo };
  }

  // ################################# Utils ##################################

  private getLevel(score: number): string {
    const level_number = Math.min(LEVELS.length - 1, Math.floor(score / LEVEL_THRESHOLD));
    return LEVELS[level_number];
  }

  private isFriend(friends: { name: string; id: string }[], userId: string): boolean {
    return friends.map((item: { name: string; id: string }) => item.id).includes(userId);
  }

  private async getGamesStats(): Promise<GamesStats> {
    const gamesStats: GamesStats = {};
    const rawData = await this.extractGamesData();
    rawData.forEach((game) => {
      const { playerOne, playerOneScore, playerTwo, playerTwoScore } = game;
      const playerOneData = gamesStats[playerOne.id] || { nbGames: 0, rank: 0, score: 0, wins: 0, defeats: 0 };
      const playerTwoData = gamesStats[playerTwo?.id] || { nbGames: 0, rank: 0, score: 0, wins: 0, defeats: 0 };
      playerOneData.score += playerOneScore;
      playerOneData.nbGames += 1;
      playerTwoData.score += playerTwoScore;
      playerTwoData.nbGames += 1;
      if (playerOneScore > playerTwoScore) {
        playerOneData.wins += 1;
        playerTwoData.defeats += 1;
      } else {
        playerTwoData.wins += 1;
        playerOneData.defeats += 1;
      }
      gamesStats[playerOne.id] = playerOneData;
	  if (playerTwo)
		  gamesStats[playerTwo.id] = playerTwoData;
    });
    const ranks = Object.keys(gamesStats).sort((a, b) => {
      return gamesStats[b].score - gamesStats[a].score;
    });
    let previousId = "";
    ranks.forEach((userId, index) => {
      if (!previousId) {
        gamesStats[userId].rank = index + 1;
      } else if (gamesStats[userId].score === gamesStats[previousId].score) {
        gamesStats[userId].rank = gamesStats[previousId].rank;
      } else {
        gamesStats[userId].rank = index + 1;
      }
      previousId = userId;
    });
    return gamesStats;
  }

  private addGamesStatsToUser(user: UserStats, games: GamesStats): UserStats {
    if (user.id in games) {
      user.rank = games[user.id].rank;
      user.score = games[user.id].score;
      user.wins = games[user.id].wins;
      user.defeats = games[user.id].defeats;
      user.nbGames = games[user.id].nbGames;
    } else if (Object.keys(games).length) {
      const {
        score: lowestScore,
        rank: maxRank,
        ...rest
      } = Object.values(games).sort((a, b) => {
        return a.score - b.score;
      })[0];
      user.rank = lowestScore === 0 ? maxRank : Object.values(games).length + 1;
    }
    user.level = this.getLevel(user.score);
    return user;
  }

  // ################ Public functions called by a controller #################

  async getUserStats(currentUser: User, targetUser: User): Promise<UserStats> {
    const user = await this.extractUserData(currentUser, targetUser.id);
    const games = await this.getGamesStats();
    return this.addGamesStatsToUser(user, games);
  }

  async getUsersStats(currentUser: User): Promise<UserStats[]> {
    const myUserId = currentUser.id;
    const rawData = await this.extractUsersData();
    const games = await this.getGamesStats();
    const currentUserFriends = await this.getUserFriends(currentUser.id);
    const users: UserStats[] = rawData
      .map((userRawData) => {
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
          nbGames: 0,
          level: "",
          isMe: userRawData.id === myUserId,
          isFriend: this.isFriend(currentUserFriends, userRawData.id),
        };
        const user = { ...rest, friends, ...otherInfo };
        return this.addGamesStatsToUser(user, games);
      })
      .sort((a, b) => {
        return a.rank - b.rank;
      });
    return users;
  }

  async getHistory(currentUser: User, targetUser: User): Promise<GameData[]> {
    const matches = await this.extractGamesData();
    return matches.filter((match) => {
      return targetUser.id === match.playerOne.id || targetUser.id === match.playerTwo?.id;
    });
  }
}
