import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { sout } from 'users/users.service';

@Processor('email')
export class EmailWorker extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    sout(job);
    return Promise.resolve(true);
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job, token?: string) {}
}
