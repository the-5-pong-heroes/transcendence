import { Test, TestingModule } from "@nestjs/testing";
import { userService } from "../src/models/users/users.service";

describe("userService", () => {
  let service: userService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [userService],
    }).compile();

    service = module.get<userService>(userService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
