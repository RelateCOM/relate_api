import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: number;

  @Column({
    length: 15,
  })
  username: string;

  @Column({
    length: 30,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
