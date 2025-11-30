import { Resolver, Query, Mutation, Args   } from '@nestjs/graphql';
import { NotifcationService } from './notifcation.service';
import { Notifcation } from './entities/notifcation.entity';
import { CreateNotifcationInput } from './dto/create-notifcation.input';
import { UpdateNotifcationInput } from './dto/update-notifcation.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => Notifcation)
export class NotifcationResolver {
  constructor(private readonly notifcationService: NotifcationService) {}

  @Mutation(() => Notifcation)
  createNotifcation(
    @Args('createNotifcationInput')
    createNotifcationInput: CreateNotifcationInput,
  ) {
    return this.notifcationService.sendNotification(createNotifcationInput);
  }

  @Query(() => [Notifcation], { name: 'allNotifcation' })
  findAll(
    @Args('user_id', { type: () => String }) user_id: string,
  ): Promise<Notifcation[]> {
    return this.notifcationService.getAllNotificationsForUser(user_id);
  }

  @Query(() => Notifcation, { name: 'notifcation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.notifcationService.findOne(id);
  }

  @Mutation(() => Notifcation)
  updateNotifcation(
    @Args('updateNotifcationInput')
    updateNotifcationInput: UpdateNotifcationInput,
  ) {
    return this.notifcationService.update(updateNotifcationInput);
  }

  @Mutation(() => Notifcation)
  removeNotifcation(@Args('id', { type: () => String }) id: string) {
    return this.notifcationService.remove(id);
  }
}
