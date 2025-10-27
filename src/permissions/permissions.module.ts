import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Module({
  providers: [PermissionsService],
  exports: [PermissionsService],
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionsModule {}
