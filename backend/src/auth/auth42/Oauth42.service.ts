import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class Oauth42Service {
  constructor(
    private prisma: PrismaService) {}

}