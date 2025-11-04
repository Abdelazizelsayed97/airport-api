import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmResolver } from './fcm.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fcm } from './entities/fcm.entity';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fcm]), UsersModule],
  providers: [FcmResolver, FcmService],
  exports: [FcmService],
})
export class FcmModule {}
