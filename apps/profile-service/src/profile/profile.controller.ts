import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('profile.create')
  create(@Payload() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @MessagePattern('profile.findAll')
  findAll() {
    return this.profileService.findAll();
  }

  @MessagePattern('profile.findOne')
  findOne(@Payload() userId: number) {
    return this.profileService.findOne(userId);
  }

  @MessagePattern('profile.update')
  update(@Payload() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(
      updateProfileDto.userId,
      updateProfileDto,
    );
  }

  @MessagePattern('profile.remove')
  remove(@Payload() userId: number) {
    return this.profileService.remove(userId);
  }
}
