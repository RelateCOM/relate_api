import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessagesEntity } from './Messages.entity';

@Entity({ name: 'chats' })
export class ChatsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_chat_id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'user_id1',
  })
  UserId1: number;

  @Column({
    type: 'int',
    name: 'user_id2',
  })
  UserId2: number;

  @OneToMany(() => MessagesEntity, (message) => message.chatId)
  messages: MessagesEntity[];
}
