import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGuard } from "src/auth/user.guard";

@Controller("users")
@UseGuards(UserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get("me")
  async findMe(@Req() req: any) {
    return await this.usersService.findOneById(req.user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.usersService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    const user = await this.usersService.findOneById(id);
    // if (req.user.roles === 0 && req.user.id !== user?.id) {
    //   throw new BadRequestException("Unauthorized");
    // }
    return this.usersService.remove(id);
  }
}
