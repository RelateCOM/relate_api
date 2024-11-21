import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Model of table for user's authorization
@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: number;

  @Column({
    length: 20,
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
  password: string;
}
