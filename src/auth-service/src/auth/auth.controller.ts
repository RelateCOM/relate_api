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

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {} // injection service

  @MessagePattern('signIn')
  signIn(@Payload() signInDto: SignInDto): Promise<object> {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern('signUp')
  signUp(@Payload() signUpDto: SignUpDto): Promise<object> {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() refreshTokenDto: RefreshTokenDto): Promise<object> {
    return this.authService.refresh(refreshTokenDto);
  }

  @MessagePattern('logout')
  logout(@Payload() { token }: RefreshTokenDto): Promise<object> {
    return this.authService.logout(token);
  }

  @MessagePattern('add.role')
  addRoleToUser(@Payload() addRoledto: AddRoleAddDto): Promise<object> {
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
