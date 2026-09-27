import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { BorrowingsModule } from './borrowings/borrowings.module';

@Module({
  imports: [PrismaModule, BooksModule, UsersModule, BorrowingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
