import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern('auth.signUp')
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('auth.signIn')
  signIn(@Payload() signIpDto: SignInDto) {
    return this.authService.signIn(signIpDto);
  }

  @MessagePattern('auth.logout')
  logout(@Payload() token: string) {
    return this.authService.logout(token);
  }

  @MessagePattern('auth.refreshToken')
  refreshToken(@Payload() token: string) {
    return this.authService.refreshToken(token);
  }
}
