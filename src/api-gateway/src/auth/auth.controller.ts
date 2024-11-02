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
import { SignInDto } from '../../../auth-service/src/auth/dto/sign-in.dto';
import { SignUpDto } from '../../../auth-service/src/auth/dto/sign-up.dto';
import { RefreshTokenDto } from '../../../auth-service/src/auth/dto/refresh-token.dto';
import { Response } from 'express';

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
    const { user, tokens } = this.authClient.send('signIn', signInDto);
    response.cookie('accessToken', `Bearer ${tokens.accessToken}`, {
      sameSite: 'lax',
      path: '/',
      secure: false,
      httpOnly: true,
    });

    response.send({
      user,
      token: tokens.refreshToken,
    });
  }

  @Post('/sign_up')
  signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = this.authClient.send('signUp', signUpDto);
    response.cookie('accessToken', `Bearer ${tokens.accessToken}`, {
      sameSite: 'lax',
      path: '/',
      secure: false,
      httpOnly: true,
    });

    response.send({
      user,
      token: tokens.refreshToken,
    });
  }

  @Post('/refresh')
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = this.authClient.send('refresh', refreshTokenDto);
    response.cookie('accessToken', `Bearer ${tokens.accessToken}`, {
      sameSite: 'lax',
      path: '/',
      secure: false,
      httpOnly: true,
    });

    response.send({
      token: tokens.refreshToken,
    });
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
