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
          body: `grant_type=authorization_code&client_id=u-s4t2ud-1f837ff40c5bf2060ef73b6c1d0ef7ea8d1a9cfcde44e0ac29fff0b2049f91ef&client_secret=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&code=/auth/auth42/callback`,
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
                              password: 'test',
                              isRegistered: isRegistered,
                              accessToken: token,
                              email: user42.email,
                          }
                      },
                      status: "ONLINE",
                      lastLogin: new Date()
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
