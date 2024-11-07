import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AddRoleAddDto } from './dto/addRole.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {} // injection service

  @MessagePattern('signIn')
  signIn(@Payload() signInDto: SignInDto, response: Response) {
    return this.authService.signIn(signInDto, response);
  }

  @MessagePattern('signUp')
  signUp(@Payload() signUpDto: SignUpDto, response: Response) {
    return this.authService.signUp(signUpDto, response);
  }

  @MessagePattern('refresh')
  refresh(@Payload() refreshTokenDto: RefreshTokenDto, response: Response) {
    return this.authService.refresh(refreshTokenDto, response);
  }

  @MessagePattern('logout')
  logout(@Payload() refreshTokenDto: RefreshTokenDto, response: Response) {
    return this.authService.logout(refreshTokenDto, response);
  }

  @MessagePattern('add.role')
  addRoleToUser(@Payload() addRoledto: AddRoleAddDto) {
    return this.authService.addRoleToUser(addRoledto);
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
