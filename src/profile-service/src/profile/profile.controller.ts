import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @MessagePattern('create.profile')
  createProfile(@Payload() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @MessagePattern('get.users')
  getAllUsers(): Promise<ProfileEntity[]> {
    return this.profileService.getAllUsers();
  }

  @MessagePattern('get.one.user')
  getOneUser(id: number): Promise<ProfileEntity> {
    return this.profileService.getOneUser(+id);
  }

  @MessagePattern('update.user')
  updateUser(
    @Payload() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    return this.profileService.updateUser(
      Number(updateProfileDto.id),
      updateProfileDto,
    );
  }

  @MessagePattern('delete.user')
  deleteUser(@Payload() id: number) {
    return this.profileService.deleteUser(+id);
  }
}
