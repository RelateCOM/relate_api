import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/guard/auth-roles.decorator/auth-roles.decorator';
import { RoleAuthGuard } from 'src/guard/role-auth/role-auth.guard';
import { Response } from 'express';
import { SignInDto } from 'src/dto/sign-in.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { RefreshTokenDto } from 'src/dto/refresh-token.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {}

  @Post('/sign_in')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authClient.send('signIn', { signInDto, response });
  }

  @Post('/sign_up')
  signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authClient.send('signUp', { signUpDto, response });
  }

  @Post('/refresh')
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authClient.send('refresh', { refreshTokenDto, response });
  }

  @Post('/logout')
  logout(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authClient.send('logout', { refreshTokenDto, response });
  }

  @Roles('ADMIN')
  @UseGuards(RoleAuthGuard)
  @Get('/users')
  getAllUsers() {
    return this.authClient.send('get.users.auth', '');
  }

  @Roles('ADMIN')
  @UseGuards(RoleAuthGuard)
  @Post('/role')
  addRoleToUser(@Body() role: { value: string; userId: number }) {
    return this.authClient.send('add.role', role);
  }
}
