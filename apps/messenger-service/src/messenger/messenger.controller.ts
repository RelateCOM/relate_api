import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessengerService } from './messenger.service';

@Controller()
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  // @MessagePattern('createMessenger')
  // create(@Payload() createMessengerDto: CreateMessengerDto) {
  //   return this.messengerService.create(createMessengerDto);
  // }

  @MessagePattern('findAllMessenger')
  findAll() {
    return this.messengerService.findAll();
  }

  @MessagePattern('findOneMessenger')
  findOne(@Payload() id: number) {
    return this.messengerService.findOne(id);
  }

  // @MessagePattern('updateMessenger')
  // update(@Payload() updateMessengerDto: UpdateMessengerDto) {
  //   return this.messengerService.update(updateMessengerDto.id, updateMessengerDto);
  // }

  @MessagePattern('removeMessenger')
  remove(@Payload() id: number) {
    return this.messengerService.remove(id);
  }
}
