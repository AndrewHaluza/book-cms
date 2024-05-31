import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';
import { RoleService } from '../role.service';
import { SessionUser } from 'src/components/users/dto/session-user.dto';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = this.getRequest(context);
    const user: SessionUser = request.user;

    return this.roleService.matchRoles(roles, user.role);
  }
}
