import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { UserNotFoundException } from './exceptions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return currentUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { username, name, avatar } = updateUserDto;

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        avatar,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async findOneUserById(userId: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookedCars: true,
            likedCars: true,
          },
        },
      },
    });

    if (!foundUser) throw new UserNotFoundException();

    return foundUser;
  }
}
