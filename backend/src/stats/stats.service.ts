import { Injectable } from "@nestjs/common";

@Injectable({})
export class StatsService {
  helloworld() {
    return { msg: "hey you" };
  }
}
