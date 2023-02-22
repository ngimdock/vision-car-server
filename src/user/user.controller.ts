import { Controller, Get } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorator';
import { UserRoutes } from './enums';
import { UserService } from './user.service';

@Controller(UserRoutes.users)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(UserRoutes.me)
  findMe(@GetUserId() userId: string) {
    return this.userService.findMe(userId);
  }

  // updateUser() {}
}
