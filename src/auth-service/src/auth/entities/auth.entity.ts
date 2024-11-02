import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IUserCreationAuthAttrs } from '../interfaces/auth.interface';
import { RoleEntity } from 'src/role/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_auth' })
export class AuthEntity implements IUserCreationAuthAttrs {
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

  @ManyToMany(() => RoleEntity, (role) => role.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  role: RoleEntity[];

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
