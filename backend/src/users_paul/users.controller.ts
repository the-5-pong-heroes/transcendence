import { Controller, Get, Param, Delete, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("me")
  async findMe(@Req() req: any) {
    return await this.usersService.findOneById(req.user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    const user = await this.usersService.findOneById(id);
    if (req.user.roles === 0 && req.user.id !== user?.id) throw new BadRequestException("Unauthorized");
    return user;
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    const user = await this.usersService.findOneById(id);
    if (req.user.roles === 0 && req.user.id !== user?.id) throw new BadRequestException("Unauthorized");
    return this.usersService.remove(id);
  }
}
