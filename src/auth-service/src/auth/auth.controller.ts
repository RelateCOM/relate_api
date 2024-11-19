import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('signIn')
  signIn(@Payload() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern('signUp')
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @MessagePattern('logout')
  logout(@Payload() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @MessagePattern('get.profile')
  getProfile(@Payload() id: number) {
    return this.authService.getProfile(id);
  }

  @MessagePattern('get.users.auth')
  getAllUsers(): Promise<object[]> {
    return this.authService.getAllUsers();
  }

  @MessagePattern('delete.user')
  deleteUser(@Payload() id: number) {
    return this.authService.deleteUser(Number(id));
  }
}
