import { BadRequestException, Injectable } from '@nestjs/common';
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

      include: {
        creditCards: true,
        bookedCars: {
          select: {
            id: true,
            bookedAt: true,
            quantity: true,
            car: {
              select: {
                id: true,
                brand: true,
                description: true,
                images: true,
                price: true,
              },
            },
          },
        },

        savedCars: {
          select: {
            id: true,
            brand: true,
            description: true,
            images: true,
            price: true,
            reductionPercent: true,
          },
        },
      },
    });

    return currentUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { username, name, avatar } = updateUserDto;

    if (username) {
      const usernameAlreadyTaken = await this.findOneUserByUsername(username);

      if (usernameAlreadyTaken)
        throw new BadRequestException('Username already taken.');
    }

    const updatedUser = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        avatar,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    await this.findOneUserById(userId);

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
            savedCars: true,
          },
        },
      },
    });

    if (!foundUser) throw new UserNotFoundException();

    return foundUser;
  }

  private async findOneUserByUsername(username: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return foundUser;
  }
}
