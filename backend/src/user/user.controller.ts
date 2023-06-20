import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGuard } from "src/auth/user.guard";
import { Request } from "express";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

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
    return await this.userService.findOneById(req.user?.id);
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
    // if (req.user.roles === 0 && req.user.id !== user?.id) {
    //   throw new BadRequestException("Unauthorized");
    // }
    return this.userService.remove(id);
  }
}
