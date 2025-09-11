import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorator/roles.decorator';

interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
  username: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const user = request.user;

    if (!user || typeof user !== 'object' || !('role' in user)) {
      return false;
    }

    const typedUser = user as AuthenticatedUser;
    return requiredRoles.some((role) => typedUser.role === role);
  }
}
