import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { UserNotFoundException } from './exceptions';
import { CreateUserData } from './type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserData: CreateUserData) {
    const { email, hash } = createUserData;

    const newUser = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }

  async findMe(userId: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        creditCards: true,
        orders: true,
        bookedCars: {
          where: {
            isOrdered: {
              equals: false,
            },
          },

          select: {
            id: true,
            bookedAt: true,
            quantity: true,
            isOrdered: true,
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

        shipmentContry: {
          select: {
            price: true,
            contry: {
              select: {
                name: true,
                code: true,
                tax: true,
              },
            },
          },
        },

        ordersToShip: {
          select: {
            id: true,
            status: true,
            validatedAt: true,
            shippedAt: true,
            deliveryContry: {
              select: {
                name: true,
                code: true,
                tax: true,
              },
            },
            paymentType: true,
          },
        },
      },
    });

    delete currentUser.hash;

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

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
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

  async verifiedEmail(email: string) {
    await this.findOneByEmail(email);

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  private async findOneUserByUsername(username: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return foundUser;
  }

  async findUserByRole(userId: string, role: Role) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: role,
      },

      select: {
        shipmentContry: {
          select: {
            contry: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!foundUser) throw new UserNotFoundException();

    return foundUser;
  }
}
