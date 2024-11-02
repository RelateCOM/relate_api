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
import { Request } from 'express';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.accessToken?.split(' ')[1];
  }

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

      const token: string | undefined = this.extractTokenFromCookie(request);

      if (!token) throw new UnauthorizedException('Token not found');
      try {
        const payload = this.jwtService.verify(token);
        request.userId = payload.userId;
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
