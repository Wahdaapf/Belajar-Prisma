import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

// TODO: Implement per issue
// GET    /users          - list all users
// GET    /users/:id      - get user by id (include borrowing history)
// POST   /users          - create user
// PATCH  /users/:id      - update user
// DELETE /users/:id      - delete user

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
