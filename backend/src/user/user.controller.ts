import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Post("me/username/get")
  // getUsername(@Req() req: Request) {
  //   return this.userService.getUsername(req);
  // }

  @Get("me")
  async findMe(@CurrentUser() user: User) {
    return await this.userService.findOneById(user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.userService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    if (id) {
      const user = await this.userService.findOneById(id);
      if (user) {
        this.userService.remove(id);
      }
    }
  }
}
