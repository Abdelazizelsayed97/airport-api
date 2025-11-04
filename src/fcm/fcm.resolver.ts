import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Fcm } from './entities/fcm.entity';
import { AuthGuard } from 'auth/guard/auth.guard';
import { FcmService } from './fcm.service';
import { CreateFcmInput } from './dto/create-fcm.input';
import { CurrentUser } from 'auth/decorators/current-user.decorator';

@Resolver(() => Fcm)
export class FcmResolver {
  constructor(private fcmServices: FcmService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Fcm)
  async registerFcmToken(
    @CurrentUser() ctx,
    @Args('input') input: CreateFcmInput,
  ): Promise<Fcm> {
    const user = ctx;
    return this.fcmServices.registerToken(user, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async removeFcmToken(@Args('token') token: string) {
    return await this.fcmServices.removeToken(token);
  }
}
