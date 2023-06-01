import { Module } from "@nestjs/common";
import { MyProfileController, StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { StatsGuard } from "./guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [StatsController, MyProfileController],
  imports: [AuthModule],
  providers: [StatsService, StatsGuard],
})
export class StatsModule {
  // helloworld() {}
}
