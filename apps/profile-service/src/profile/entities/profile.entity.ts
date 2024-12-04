import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ProfileEntity' })
export class ProfileEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_profile_id',
  })
  id: number;

  @Column({ type: 'int', default: null, unique: true })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
  })
  avatarPath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
