import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import fetch from "node-fetch";
import { API_42_ID, API_42_SECRET, API_42_URI } from "../../common/constants";
import { API_42_NEW_TOKEN, API_42_USER } from "src/common/constants/auth";

@Injectable()
export class Oauth42Service {
  constructor(private prisma: PrismaService) {}

  async accessToken(req: string) {
    try {
      const response = await fetch(API_42_NEW_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=authorization_code&client_id=${API_42_ID}&client_secret=${API_42_SECRET}&code=${req}&redirect_uri=${API_42_URI}`,
      });
      const data = await response.json();
      if (!data) {
        throw new BadRequestException("the user token is empty");
      }
      return data;
    } catch (error) {
      throw new BadRequestException("Error to get the user by token3");
    }
  }
  async access42UserInformation(accessToken: string) {
    try {
      const response = await fetch(API_42_USER, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log("Fetch42 user doesnt work, next step is testing with googleapi");
    }
    return null;
  }

  async createDataBase42User(user42: any, token: string, username: string, isRegistered: boolean) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: username,
          auth: {
            create: {
              isRegistered: isRegistered,
              accessToken: token,
              email: user42.email,
            },
          },
          status: "ONLINE",
          lastLogin: new Date(),
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Error to create the user to the database");
    }
  }
}
