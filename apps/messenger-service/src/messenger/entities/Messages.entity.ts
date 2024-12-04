import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatsEntity } from './Chats.entity';

@Entity({ name: 'messages' })
export class MessagesEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_message_id',
  })
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'int',
    name: 'sender_id',
  })
  senderId: number;

  @ManyToOne(() => ChatsEntity, (chat) => chat.id)
  @JoinColumn({ name: 'chat_id' })
  chatId: ChatsEntity;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    name: 'is_read',
    default: false,
  })
  isRead: boolean;
}
