import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  //Checking user have any the roles present in @Role metadata of method
  matchRoles(allowedRoles: string[], UserRoles: Role[]): boolean {
    let isAllowed = false;
    const roleSet: Set<string> = new Set(allowedRoles);
    UserRoles.forEach((role) => {
      if (roleSet.has(role.name)) isAllowed = true;
    });

    return isAllowed;
  }
}
