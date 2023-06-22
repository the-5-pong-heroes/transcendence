import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";
import { UserWithAuth, UserWithFriends } from "src/common/@types";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserWithAuth> {
    return this.userService.create(createUserDto);
  }

  @Get("me")
  async findMe(@CurrentUser() user: User): Promise<UserWithFriends | null> {
    return await this.userService.findOneById(user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UserWithFriends | null> {
    return await this.userService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    if (id) {
      const user = await this.userService.findOneById(id);
      if (user) {
        this.userService.remove(id);
      }
    }
  }
}
