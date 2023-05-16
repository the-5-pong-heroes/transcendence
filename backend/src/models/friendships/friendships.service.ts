import { Injectable } from "@nestjs/common";
import { AddFriendDto } from "./add-friend.dto";

@Injectable()
export class FriendshipsService {
  create(createFriendshipDto: AddFriendDto) {
    return "This action adds a new friendship";
  }

  findAll() {
    return `This action returns all friendships`;
  }

  findOne(id: string) {
    return `This action returns a #${id} friendship`;
  }

  remove(id: string) {
    return `This action removes a #${id} friendship`;
  }
}
