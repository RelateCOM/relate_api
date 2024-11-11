import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RoleEntity } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AddRoleAddDto } from './dto/addRole.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private roleService: RoleService,
  ) {}

  private async getUserByEmail(email: string): Promise<AuthEntity | null> {
    const user = await this.authRepository.findOne({
      where: { email },
      relations: {
        role: true, // Bidirectional relations one-to-one
      },
    });
    return user;
  }

  private async validateUser(signInDto: SignInDto): Promise<AuthEntity> {
    const { email, password } = signInDto;
    const user = await this.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email');

    const isPasswordMatched = bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid password');

    return user;
  }

  private async createUser(userDto: SignUpDto): Promise<AuthEntity> {
    let user_role = await this.roleService.getRoleByValue('USER');

    const { email, username, password } = userDto;

    if (!user_role) {
      const newRole = await this.roleRepository.create({
        value: 'USER',
        description: 'User',
      });
      await this.roleRepository.save(newRole);
      user_role = await this.roleService.getRoleByValue('USER');
    }

    if (email == process.env.SUPER_USER) {
      const admin = await this.roleRepository.create({
        value: 'ADMIN',
        description: 'Administrator',
      });
      await this.roleRepository.save(admin);
      user_role = await this.roleService.getRoleByValue('ADMIN');
    }

    // Save data in table user_auth
    const user_auth = await this.authRepository.save({
      username,
      email,
      password,
      role: [user_role],
      relations: { role: true },
    });
    return user_auth;
  }

  async generateUserTokens(user: AuthEntity) {
    const { id, email, role } = user;
    const accessToken = await this.jwtService.signAsync(
      { id, role },
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
    const candidate = await this.getUserByEmail(email);

    if (candidate) {
      throw new UnauthorizedException(
        `User with login ${email} already exists!`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const tokens = await this.generateUserTokens(user);

    return {
      user,
      tokens,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto);

    const tokens = await this.generateUserTokens(user);

    return {
      user,
      tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const token = await this.jwtService.verifyAsync(dto.refreshToken);
    if (!token) throw new UnauthorizedException('Refresh token is invalid');

    const user = await this.getUserByEmail(token.email);
    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.generateUserTokens(user);

    return {
      tokens,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const token = await this.jwtService.verifyAsync(refreshToken);
      token.destroy();
    } catch (err) {
      console.error('Error logging out user:', err);
      throw new UnauthorizedException('Failed to log out user');
    } finally {
      return { message: 'User logged out successfully' };
    }
  }

  async addRoleToUser(dto: AddRoleAddDto): Promise<AuthEntity> {
    const user = await this.authRepository.findOne({
      where: { id: dto.userId },
      relations: { role: true },
    });
    const user_role = await this.roleService.getRoleByValue(dto.value);
    if (user_role && user) {
      user.role.push(user_role);
      await this.authRepository.save(user);
      return user;
    }
    throw new HttpException('User or role are not found', HttpStatus.NOT_FOUND);
  }

  async getAllUsers(): Promise<AuthEntity[]> {
    return await this.authRepository.find();
  }

  async deleteUser(userId: number): Promise<any> {
    return await this.authRepository.delete(userId);
  }

  async getProfile(userId: number) {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
