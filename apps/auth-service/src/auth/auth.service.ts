import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  private async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await lastValueFrom(
      this.usersClient.send('users.findByEmail', email),
    );
    if (!user) throw new UnauthorizedException('Invalid email');

    const isPasswordMatched = bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid password');

    return user;
  }

  private async generateUserTokens({
    id,
    email,
  }: {
    id: number;
    email: string;
  }) {
    const accessToken = await this.jwtService.signAsync(
      { id },
      { expiresIn: '5min' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { email },
      { expiresIn: '14d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;
    const candidate = await lastValueFrom(
      this.usersClient.send('users.findByEmail', email),
    );
    if (candidate) {
      throw new HttpException(
        `User with login ${email} already exists!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await lastValueFrom(
      this.usersClient.send('users.create', {
        username,
        email,
        password: hashedPassword,
      }),
    );

    const tokens = await this.generateUserTokens({
      id: user.id,
      email,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      tokens,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto);

    const tokens = await this.generateUserTokens({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      tokens,
    };
  }

  async logout(refreshToken: string) {
    const token = await this.jwtService.verifyAsync(refreshToken);
    if (!token) throw new UnauthorizedException('Refresh token is invalid');
    // TODO: Implement actual logout logic here (e.g., invalidate refresh token)

    return {
      message: 'Logged out successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.jwtService.verifyAsync(refreshToken);
    if (!token) throw new UnauthorizedException('Refresh token is invalid');

    const user = await lastValueFrom(
      this.usersClient.send('users.findByEmail', token.email),
    );

    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.generateUserTokens({
      id: user.id,
      email: user.email,
    });

    return {
      tokens,
    };
  }
}
