import { Controller } from '@nestjs/common';
import { BooksService } from './books.service';

// TODO: Implement per issue
// GET    /books          - list all books (with pagination & filter)
// GET    /books/:id      - get book by id
// POST   /books          - create book
// PATCH  /books/:id      - update book
// DELETE /books/:id      - delete book

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
}
