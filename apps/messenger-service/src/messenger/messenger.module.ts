import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsEntity } from './entities/Chats.entity';
import { MessagesEntity } from './entities/Messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatsEntity, MessagesEntity])],
  controllers: [MessengerController],
  providers: [MessengerService],
})
export class MessengerModule {}
