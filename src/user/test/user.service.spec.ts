import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStub } from '../stubs';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(UserStub),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
  });

  describe('findMe()', () => {
    describe("When it's called", () => {
      let user: User;

      beforeEach(async () => {
        user = await service.findMe(UserStub.id);
      });

      it('findUnique() have beein called', () => {
        expect(prisma.user.findUnique).toHaveBeenCalled();

        expect(prisma.user.findUnique).toHaveReturnedWith(
          Promise.resolve(UserStub),
        );
      });

      it(`user id should be #${UserStub.id}`, () => {
        expect(user.id).toEqual(UserStub.id);
      });

      it('hash to be undefined', () => {
        expect(user.hash).toBeUndefined();
      });
    });
  });
});
