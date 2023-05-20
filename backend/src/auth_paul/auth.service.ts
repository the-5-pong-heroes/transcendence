import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Auth } from "@prisma/client";
import { CreateUserDto } from "../users_paul/dto/create-user.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Auth> {
    return this.prismaService.auth.create({
      data: {
        ...createUserDto,
        user: {
          create: {
            name: createUserDto.email,
            status: "ONLINE",
          },
        },
      },
    });
  }

  async findOne(email: string): Promise<Auth | null> {
    return this.prismaService.auth.findUnique({ where: { email } });
  }

  async signUp(createUserDto: CreateUserDto): Promise<string | null> {
    const { email, password } = createUserDto;
    const user = await this.findOne(email);

    if (user) throw new BadRequestException("User already exists");

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newUser = new CreateUserDto();
    newUser.email = email;
    newUser.password = hash;

    try {
      const response = await this.create(newUser);
      const payload = { email: response.email, sub: response.userId };
      return this.jwtService.sign(payload);
    } catch (err: any) {
      if (user) throw new BadRequestException("User Creation Error");
    }
    return null;
  }

  async validateUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;
    const user = await this.findOne(email);
    if (!user) throw new BadRequestException("User Doesn't Exist");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException("Invalid Credential");
    const { password: _, ...result } = user;
    return result;
  }

  async signIn(user: Auth): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
