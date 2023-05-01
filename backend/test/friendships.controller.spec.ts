import { Test, TestingModule } from "@nestjs/testing";
import { FriendshipsController } from "../src/models/friendships/friendships.controller";
import { FriendshipsService } from "../src/models/friendships/friendships.service";

describe("FriendshipsController", () => {
  let controller: FriendshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipsController],
      providers: [FriendshipsService],
    }).compile();

    controller = module.get<FriendshipsController>(FriendshipsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
