import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { UpdateUserDto } from './dto';
import { UserRoutes } from './enums';
import { UserService } from './user.service';

@Controller(UserRoutes.users)
export class UserController {
  private static readonly userId = 'userId';

  constructor(private readonly userService: UserService) {}

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
  async deleteUser(@GetUserId() userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Roles(Role.ADMIN)
  @Get(`:${UserController.userId}`)
  findOneUserById(@Param(UserController.userId) userId: string) {
    return this.userService.findOneUserById(userId);
  }
}
