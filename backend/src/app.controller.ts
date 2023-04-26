import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("test")
  getLeaderboard(): any {
    return [
      {
        id: "dc16d5df-5eb2-4651-ac42-39b2f2365106",
        name: "jasmine",
        score: 19,
        wins: 4,
        defeats: 1,
        level: "wall-e",
      },
      {
        id: "205c401b-b6da-4d17-b93d-eb8db5635f11",
        name: "205c401b-b6da-4d17-b93d-eb8db5635f11",
        score: 15,
        wins: 3,
        defeats: 2,
        level: "eve",
      },
      {
        id: "2a80ccb2-763f-4539-8457-4af9f488c258",
        name: "2a80ccb2-763f-4539-8457-4af9f488c258",
        score: 12,
        wins: 2,
        defeats: 3,
        level: "eve",
      },
      {
        id: "bba8f60b-b10c-4bd5-aa79-c04c34988a2f",
        name: "raoul",
        score: 2,
        wins: 0,
        defeats: 3,
        level: "human",
      },
    ];
  }
}
