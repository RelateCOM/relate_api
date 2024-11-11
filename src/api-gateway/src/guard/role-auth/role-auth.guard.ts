import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../auth-roles.decorator/auth-roles.decorator';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      try {
        const authHeader = request.headers.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException({
            message: 'User is not authorized',
          });
        }
        const payload = this.jwtService.verify(token);
        request.id = payload.id;
        return payload.role.some((role) => requiredRoles.includes(role.value));
      } catch (error) {
        Logger.error(error.message);
        throw new UnauthorizedException('Invalid token');
      }
    } catch {
      throw new HttpException('Access is denied', HttpStatus.FORBIDDEN);
    }
  }
}
