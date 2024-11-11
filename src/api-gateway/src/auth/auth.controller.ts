import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/guard/auth-roles.decorator/auth-roles.decorator';
import { RoleAuthGuard } from 'src/guard/role-auth/role-auth.guard';
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
