import { Test, TestingModule } from "@nestjs/testing";
import { UserSettingsController } from "../src/user-settings/user-settings.controller";
import { UserSettingsService } from "../src/user-settings/user-settings.service";

describe("UserSettingsController", () => {
  let controller: UserSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSettingsController],
      providers: [UserSettingsService],
    }).compile();

    controller = module.get<UserSettingsController>(UserSettingsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
