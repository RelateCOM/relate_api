import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromCookie(request);

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.accessToken?.split(' ')[1];
  }
}
