import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ListAllEntities } from "./dto/list-all-entities.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "./current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    // do something with query.arg
    return this.userService.findAll();
  }

  @Get(":uuid")
  findOne(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.userService.findOne(user, uuid);
  }

  @Patch(":uuid")
  update(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, uuid, updateUserDto);
  }

  @Delete(":uuid")
  remove(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.userService.remove(user, uuid);
  }
}
