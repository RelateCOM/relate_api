import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoleEntity } from './entities/role.entity';

@Module({
  providers: [RoleService],
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    forwardRef(() => AuthModule),
  ],
  exports: [RoleService],
})
export class RoleModule {}
