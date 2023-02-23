import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Session,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { GetUserId, Roles } from 'src/auth/decorator';
import { UserSession } from 'src/auth/types';
import { UpdateUserDto } from './dto';
import { UserRoutes } from './enums';
import { UserService } from './user.service';

@Controller(UserRoutes.users)
export class UserController {
  private static readonly userId = 'userId';

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get(UserRoutes.me)
  findMe(@GetUserId() userId: string) {
    return this.userService.findMe(userId);
  }

  @Patch(UserRoutes.update)
  update(@GetUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(UserRoutes.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @GetUserId() userId: string,
    @Session() session: UserSession,
  ) {
    await this.userService.deleteUser(userId);

    this.authService.destroySession(session);
  }

  @Roles(Role.ADMIN)
  @Get(`:${UserController.userId}`)
  findOneUserById(@Param(UserController.userId) userId: string) {
    return this.userService.findOneUserById(userId);
  }
}
