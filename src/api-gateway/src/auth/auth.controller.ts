import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { Roles } from 'src/guard/auth-roles.decorator/auth-roles.decorator';
// import { RoleAuthGuard } from 'src/guard/role-auth/role-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard } from 'src/guard/jwt/jwt.guard';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {}

  @Post('/sign_in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authClient.send('signIn', signInDto);
  }

  @Post('/sign_up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authClient.send('signUp', signUpDto);
  }

  @Post('/refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authClient.send('refresh', refreshTokenDto);
  }

  @Post('/logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authClient.send('logout', refreshTokenDto);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req: Request & { id: number }) {
    return this.authClient.send('get.profile', req.id);
  }

  // @Roles('ADMIN')
  // @UseGuards(RoleAuthGuard)
  // @Get('/users')
  // getAllUsers() {
  //   return this.authClient.send('get.users.auth', '');
  // }

  // @Roles('ADMIN')
  // @UseGuards(RoleAuthGuard)
  // @Post('/role')
  // addRoleToUser(@Body() role: { value: string; userId: number }) {
  //   return this.authClient.send('add.role', role);
  // }
}
