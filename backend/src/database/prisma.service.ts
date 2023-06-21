import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const user = config.get("POSTGRES_USER");
    const pwd = config.get("POSTGRES_PASSWORD");
    const host = config.get("POSTGRES_HOST");
    const port = config.get("POSTGRES_PORT");
    const db = config.get("POSTGRES_DB");
    super({
      datasources: {
        db: { url: `postgresql://${user}:${pwd}@${host}:${port}/${db}` },
      },
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
