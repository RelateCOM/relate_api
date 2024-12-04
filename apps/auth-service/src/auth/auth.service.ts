import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('PROFILE_SERVICE') private profileClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  private async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user)
      throw new HttpException(
        `User with login ${email} not found!`,
        HttpStatus.UNAUTHORIZED,
      );

    const isPasswordMatched = bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    return user;
  }

  private async generateUserTokens(user: UserEntity) {
    const { id, email } = user;
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
    const { email, password } = signUpDto;

    const candidate = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (candidate) {
      throw new HttpException(
        `User with login ${email} already exists!`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });
    const profile = this.profileClient.send('profile.create', {
      userId: user.id,
      email,
    });
    Logger.log(profile);

    const tokens = await this.generateUserTokens(user);

    return tokens;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto);

    const tokens = await this.generateUserTokens(user);

    return tokens;
  }

  async logout(refreshToken: string) {
    // const token = await this.jwtService.verifyAsync(refreshToken);
    // if (!token) throw new UnauthorizedException('Refresh token is invalid');
    // TODO: Implement actual logout logic here (e.g., invalidate refresh token)
    Logger.log(refreshToken);
    return {
      message: 'Logged out successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.jwtService.verifyAsync(refreshToken);
    if (!token)
      throw new HttpException(
        'Refresh token is invalid',
        HttpStatus.UNAUTHORIZED,
      );

    const user = await this.userRepository.findOne({
      where: {
        email: token.email,
      },
    });

    if (!user)
      throw new HttpException(
        `User with login ${token.email} not found!`,
        HttpStatus.UNAUTHORIZED,
      );

    const tokens = await this.generateUserTokens(user);

    return tokens;
  }
}
