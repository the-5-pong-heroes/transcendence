import { NotFoundException } from "@nestjs/common";

class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`Post with id ${userId} not found`);
  }
}
