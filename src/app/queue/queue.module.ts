import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { emailQueue } from "@core/constants";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: "redis-18773.crce176.me-central-1-1.ec2.redns.redis-cloud.com",
        port: 18773,
        password: "qm5ppkFZt8s1nsOjdCxX7wrEVRDoAXAO",
        name: "test-db",
  
      },
    }),
    BullModule.registerQueue({
      name: emailQueue,
    }),
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {
  constructor() {
    console.log("QueueModule");
  }
}
