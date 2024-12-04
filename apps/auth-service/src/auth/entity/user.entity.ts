import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'UserEntity' })
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: number;

  @Column({
    length: 30,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
