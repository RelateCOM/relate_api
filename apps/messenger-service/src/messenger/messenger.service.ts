import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsEntity } from './entities/Chats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessengerService {
  constructor(
    @InjectRepository(ChatsEntity)
    private readonly chatsRepository: Repository<ChatsEntity>,
  ) {}

  findAll() {
    return `This action returns all messenger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messenger`;
  }

  // update(id: number, updateMessengerDto: UpdateMessengerDto) {
  //   return `This action updates a #${id} messenger`;
  // }

  remove(id: number) {
    return `This action removes a #${id} messenger`;
  }
}
