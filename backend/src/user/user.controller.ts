import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async getUsers(@Req() req: Request) {
    const blockedOf = req.query.blockedOf as string;
    return this.userService.getAllUsers(blockedOf);
  }

  @Post("me/username/get")
  getUsername(@Req() req: Request) {
    return this.userService.getUsername(req);
  }

  @Get("me")
  async findMe(@Req() req: any) {
    return await this.userService.findOneById(req.currentUser.id);
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
  async remove(@Param("id") id: string, @Req() req: any) {
    const user = await this.userService.findOneById(id);
    // if (req.currentUser.roles === 0 && req.currentUser.id !== user?.id) {
    //   throw new BadRequestException("Unauthorized");
    // }
    return this.userService.remove(id);
  }
}
