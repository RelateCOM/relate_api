import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}
  create(createProfileDto: CreateProfileDto) {
    const { userId, email } = createProfileDto;
    const username = email.split('@')[0];
    const newProfile = this.profileRepository.save({
      userId,
      username,
    });
    return newProfile;
  }

  findAll() {
    return this.profileRepository.find();
  }

  findOne(userId: number) {
    return this.profileRepository.findOne({ where: { userId } });
  }

  update(userId: number, updateProfileDto: UpdateProfileDto) {
    return this.profileRepository.update(userId, updateProfileDto);
  }

  remove(userId: number) {
    return this.profileRepository.delete({ userId });
  }
}
