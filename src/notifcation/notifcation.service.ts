import { Injectable, Logger } from '@nestjs/common';
import { CreateNotifcationInput } from './dto/create-notifcation.input';
import { UpdateNotifcationInput } from './dto/update-notifcation.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifcation } from './entities/notifcation.entity';
import { FcmService } from 'fcm/fcm.service';
import * as admin from 'firebase-admin';
import { sout, UsersServices } from 'users/users.service';

@Injectable()
export class NotifcationService {
  private readonly logger = new Logger(NotifcationService.name);
  constructor(
    @InjectRepository(Notifcation)
    private notifcationRepository: Repository<Notifcation>,
    readonly fcmTokenService: FcmService,
    readonly usersService: UsersServices,
  ) {}

  async getAllNotificationsForUser(user_id: string): Promise<Notifcation[]> {
    sout('user' + user_id);
    const notifcations = await this.notifcationRepository.find({
      // where: {
      //   reciver: { id: user_id },
      // },
      // relations: ['reciver'],
    });
    if (!notifcations) {
      throw new Error('Notifcation not found');
    }
    return notifcations;
  }

  findOne(id: string) {
    return;
  }

  async update(updateNotifcationInput: UpdateNotifcationInput) {
    const notifcation = this.notifcationRepository.create(
      updateNotifcationInput,
    );
    if (!notifcation) {
      throw new Error('Notifcation not found');
    }
    Object.assign(notifcation, updateNotifcationInput);
    await this.notifcationRepository.save(notifcation);
    return notifcation;
  }

  remove(id: string) {
    return this.notifcationRepository.delete(id);
  }
  async sendNotification(createNotifcationInput: CreateNotifcationInput) {

    const recipient = await this.usersService.findOne(
      createNotifcationInput.user_id,
    );
    if (!recipient) {
      throw new Error('Recipient not found');
    }
    const notifcation = await this.notifcationRepository.create({
      ...createNotifcationInput,

      reciver: recipient,
      createdAt: new Date(),
    });
    const { title, body } = notifcation;
    const tokens = await this.fcmTokenService.getUserTokens(
      createNotifcationInput.user_id,
    );
    if (!tokens.length) {
      await this.notifcationRepository.save(notifcation);
      return notifcation;
    }

    const payload = {
      notification: { title, body },
      tokens: tokens.map((t) => t.token),
    };

    await this.notifcationRepository.save(notifcation);

    const response = await admin.messaging().sendEachForMulticast(payload);
    this.logger.log(`Sent to ${response.successCount} devices`);

    return notifcation;
  }

  async markAsRead(id: string) {
    return await this.notifcationRepository.update(id, { isRead: true });
  }
}
