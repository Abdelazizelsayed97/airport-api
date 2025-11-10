import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { NotifcationModule } from "notifcation/notifcation.module";
import { QueueService } from "./queue.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "redis-18773.crce176.me-central-1-1.ec2.redns.redis-cloud.com",
        port: 18773,
        password: "qm5ppkFZt8s1nsOjdCxX7wrEVRDoAXAO",
        name: "test-db",
      },
    }),
    BullModule.registerQueue({
      name: "email",
      processors: [require.resolve("../../email/workers/email.worker")],
      limiter: {
        max: 400,
        duration: 60000,
      },
    }),
    NotifcationModule,
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {
  constructor() {
    console.log("QueueModule");
  }
}
