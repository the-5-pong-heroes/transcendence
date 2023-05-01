import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { Friendship } from "@prisma/client";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, Friendship> {
  transform(value: string, metadata: ArgumentMetadata): Friendship {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException();
    }
    return val;
  }
}
