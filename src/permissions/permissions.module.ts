import { Module } from '@nestjs/common';
import { PermissionsGuard } from './guard/permissions.guard';

@Module({
  providers: [PermissionsGuard],
  exports: [PermissionsGuard],
})
export class PermissionsModule {}
