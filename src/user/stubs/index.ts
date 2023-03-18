import { Role, User } from '@prisma/client';

const date = new Date();

export const UserStub: Readonly<User> = {
  id: 'abc',
  email: 'ngimdock@gmail.com',
  createdAt: date,
  updatedAt: date,
  avatar: null,
  contryId: null,
  emailVerified: true,
  hash: 'azertyuop',
  name: 'Ngimdock',
  role: Role.CUSTOMER,
  isBlocked: false,
  username: 'ngimdock',
};
