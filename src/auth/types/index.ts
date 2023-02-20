import { Role } from '@prisma/client';
import { Session } from 'express-session';

export type UserSessionData = {
  id: string;
  email: string;
  role: Role;
};

export type UserSession = Session & Record<'user', UserSessionData>;
