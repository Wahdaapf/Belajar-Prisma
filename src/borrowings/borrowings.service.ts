import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// TODO: Implement per issue
@Injectable()
export class BorrowingsService {
  constructor(private readonly prisma: PrismaService) {}
}
