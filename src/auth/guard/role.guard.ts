import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_ROUTE } from '../decorator';
import { ROLES_KEY } from '../decorator/role.decorator';
import { UserSession } from '../types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || isPublicRoute) return true;

    const request = context.switchToHttp().getRequest() as Request;

    const session = request.session as UserSession;

    const currentUserGetRole = roles.includes(session.user.role);

    if (!currentUserGetRole)
      throw new UnauthorizedException(
        "You don't have permission to perform this action.",
      );

    return true;
  }
}
