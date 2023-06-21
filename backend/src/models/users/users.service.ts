import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@prisma/client";

@Injectable()
export class userService {
  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    // throw new ForbiddenException();
    return `This action returns all users`;
  }

  findOne(user: User, uuid: string) {
    return `This action returns a #${uuid} user`;
  }

  update(user: User, uuid: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${uuid} user`;
  }

  remove(user: User, uuid: string) {
    // 2 possibilities:
    // either an admin is removing another user
    // or the user himself is deleting its account
    return `This action removes a #${uuid} user`;
  }
}
