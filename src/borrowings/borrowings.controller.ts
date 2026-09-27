import { Controller } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';

// TODO: Implement per issue
// POST   /borrowings           - borrow a book (transactional: check stock, create record, decrement stock)
// PATCH  /borrowings/:id/return - return a book (transactional: update status, increment stock)
// GET    /borrowings           - list all borrowings (with filter by status, userId)
// GET    /borrowings/:id       - get borrowing detail (include user & book)

@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}
}
