import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  username: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  hash: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
