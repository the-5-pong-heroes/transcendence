import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import fetch from "node-fetch";

@Injectable()
export class Oauth42Service {
  constructor(private prisma: PrismaService) {}

    async accessToken(req: string) {
      try {
        const response = await fetch("https://api.intra.42.fr/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=authorization_code&client_id=u-s4t2ud-336830374cf2f365e2cb188d4bd30d634a75c69a6bc284c027c9cb6732f3a842&client_secret=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&code=/auth/auth42/callback`,
        });
        const data = await response.json();      
        if (!data)
        {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: "the user token is empty"
            },
             HttpStatus.BAD_REQUEST); 
          };
        return data;
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "Error to get the user by token3"},
           HttpStatus.BAD_REQUEST); 
          };
      }
    async access42UserInformation(accessToken: string) {    
      try {
          const response = await fetch("https://api.intra.42.fr/v2/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (response.ok) 
          { 
          const data = await response.json();
          return data;
          }
      }
      catch(error) {
          console.log("Fetch42 user doesnt work, next step is testing with googleapi")
      }
          return null;
      }


      async createDataBase42User(
        user42: any,
        token: string,
        username: string,
        isRegistered: boolean
      ){
          try {
              const user = await this.prisma.user.create({
                  data: { 
                      name: username,
                      auth: {
                          create: {
                              accessToken: token,
                              isRegistered: isRegistered,
                              email: user42.email,
                              password: 'test',
                          }
                      },
                      status: "ONLINE",
                      last_login: new Date()
                  }
              });
              return user;
          } catch (error) {
              throw new HttpException(
                  {
                      status: HttpStatus.BAD_REQUEST,
                      error: "Error to create the user to the database"
                  }, HttpStatus.BAD_REQUEST);
          }
      }
}