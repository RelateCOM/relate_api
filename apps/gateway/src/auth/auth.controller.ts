import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dtos/SignIn.dto';
import { SignUpDto } from './dtos/SignUp.dto';
import { RefreshDto } from './dtos/Refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authClient.send('auth.signUp', signUpDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authClient.send('auth.signIn', signInDto);
  }

  @Post('/refresh')
  async refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authClient.send('auth.refreshToken', refreshDto.token);
  }

  @Post('/logout')
  logout(@Body() refreshDto: RefreshDto) {
    return this.authClient.send('auth.logout', refreshDto.token);
  }
}
