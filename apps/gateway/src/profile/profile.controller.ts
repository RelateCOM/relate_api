import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/guards/AuthGuard';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(@Inject('PROFILE_SERVICE') private profileClient: ClientProxy) {}

  @Get()
  getProfile(@Req() req) {
    return this.profileClient.send('profile.findOne', { userId: req.userId });
  }

  // @Patch()
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
