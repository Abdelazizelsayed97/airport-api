import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleResolver } from './role.resolver';
import { PermissionsModule } from 'permissions/permissions.module';

@Module({
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => PermissionsModule),
  ],
})
export class RoleModule {}
