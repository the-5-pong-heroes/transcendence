import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ListAllEntities } from "./dto/list-all-entities.dto";
import { User } from "@prisma/client";
import { CurrentUser } from "./current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    // do something with query.arg
    return this.usersService.findAll();
  }

  @Get(":uuid")
  findOne(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(user, uuid);
  }

  @Patch(":uuid")
  update(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, uuid, updateUserDto);
  }

  @Delete(":uuid")
  remove(@CurrentUser() user: User, @Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(user, uuid);
  }
}
