import { Role, User } from '@prisma/client';

const date = new Date();

export const UserStub: Readonly<User> = {
  id: 'be8cb74e-ce31-4b9c-b902-f43e7954b61b',
  email: 'ngimdock.zemfack@facsciences-uy1.cm',
  hash: '$2crzczczc',
  emailVerified: true,
  username: null,
  name: null,
  avatar: null,
  role: Role.CUSTOMER,
  isBlocked: false,
  createdAt: date,
  updatedAt: date,
  contryId: null,
};
