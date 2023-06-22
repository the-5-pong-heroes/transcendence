import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
// import fetch from "node-fetch";
import { API_42_NEW_TOKEN, API_42_REDIRECT_SUCCESS, API_42_USER_INFO } from "src/common/constants/auth";
import { ConfigService } from "@nestjs/config";
import { Token } from "src/common/@types";
import { User42Infos } from "../interface";

@Injectable()
export class Oauth42Service {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async accessToken(code: string): Promise<string> {
    if (!code) {
      // the data validation should have been done in the controller
      throw new Error("Code is an empty string");
    }
    // The client ID you received from 42 when you registered
    const client_id = this.config.get("API_42_ID");
    // The client secret you received from 42 when you registered
    const secret = this.config.get("API_42_SECRET");
    try {
      const init: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: client_id,
          client_secret: secret,
          code: code,
          redirect_uri: API_42_REDIRECT_SUCCESS,
        }),
      };
      const response = await fetch(API_42_NEW_TOKEN, init);
      const data = (await response.json()) as Token;
      if (!data.access_token) {
        // the token we've just received should not be empty
        throw new BadRequestException("The API has returned an invalid token!");
      }
      return data.access_token;
    } catch (error) {
      throw new BadRequestException(`Failed to get the user token with the code ${code}`);
    }
  }

  async access42UserInformation(accessToken: string): Promise<User42Infos | null> {
    try {
      const response = await fetch(API_42_USER_INFO, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = (await response.json()) as User42Infos;
        return { id: data.id, email: data.email, login: data.login };
      }
    } catch (error) {
      console.error(`❌ Failed to get user information: ${error}}`);
    }
    return null;
  }

  async createDataBase42User(user42: User42Infos, token: string, username: string, isRegistered: boolean) {
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
