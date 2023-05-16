import { Injectable, BadRequestException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Auth } from "@prisma/client";
import { UserService } from "../user/user.service";
import { SignInDto, SignUpDto } from "./dto";
import { CreateUserDto } from "../user/dto";
import { User } from "@prisma/client";

export interface UserAuth {
  accessToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async signUp(createUserDto: SignUpDto): Promise<UserAuth> {
    const { name, email, password } = createUserDto;

    const userByName = await this.userService.findUserByName(name);
    if (userByName) {
      throw new ConflictException("User already exists");
    }

    const userByEmail = await this.userService.findUserAuthByEmail(email);
    if (userByEmail) {
      throw new ConflictException("Email already used");
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newUser = new CreateUserDto(name, email, hash);

    const createdUser = await this.userService.create(newUser);
    const payload = { name: createdUser.name, sub: createdUser.id };

    return {
      accessToken: this.jwtService.sign(payload),
      user: createdUser,
      // user: {
      //   name: response.name,
      //   id: response.id,
      // },
    };
  }

  async validateUser(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const userAuth = await this.userService.findUserAuthByEmail(email);
    if (!userAuth) {
      throw new BadRequestException("User doesn't exist");
    }
    const isMatch = await bcrypt.compare(password, userAuth.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }
    const { password: _, ...result } = userAuth;
    return result;
  }

  async signIn(auth: Auth): Promise<UserAuth> {
    const payload = { email: auth.email, sub: auth.userId };
    const user = await this.userService.findOne(auth.userId);

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }
}
