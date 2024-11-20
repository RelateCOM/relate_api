import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  async signUp(signUpDto: SignUpDto) {
    return this.usersClient.send('signUp', signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    return this.usersClient.send('signIn', signInDto);
  }

  async logout(token: string) {
    return this.usersClient.send('logout', token);
  }

  async refreshToken(token: string) {
    return this.usersClient.send('refreshToken', token);
  }
}
