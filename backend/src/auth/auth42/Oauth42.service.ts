import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import fetch from "node-fetch";
import { API_42_NEW_TOKEN, API_42_USER } from "src/common/constants/auth";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Oauth42Service {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async accessToken(req: string) {
    // TODO POST to API_42_NEW_TOKEN
    // const body = {
    //   grant_type: "authorization_code",
    //   // The client ID you received from 42 when you registered
    //   client_id: config.get("API_42_ID"),
    //   // The client secret you received from 42 when you registered
    //   client_secret: config.get("API_42_SECRET"),
    //   code: code,
    //   redirect_uri: API_42_REDIRECT,
    // };
    try {
      const client_id = this.config.get("API_42_ID");
      const secret = this.config.get("API_42_SECRET");
      const uri = this.config.get("VITE_API42_URI");
      const response = await fetch(API_42_NEW_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=authorization_code&client_id=${client_id}&client_secret=${secret}&code=${req}&redirect_uri=${uri}`,
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
