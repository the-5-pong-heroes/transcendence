import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
	imports: [PrismaModule, CloudinaryModule, BlockedModule],
	controllers: [UserController],
	providers: [UserService, BlockedService],
	exports: [UserService],
})
export class UserModule {}
