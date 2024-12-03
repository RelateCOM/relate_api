import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/AuthGuard';

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersClient.send('users.findAll', {});
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req) {
    console.log(req.id);
    return this.usersClient.send('users.findById', { id: req.id });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
