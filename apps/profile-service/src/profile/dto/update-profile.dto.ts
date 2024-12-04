import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;

  @IsString()
  bio: string;

  @IsBoolean()
  isVerified: boolean;

  @IsString()
  avatarPath: string;
}
