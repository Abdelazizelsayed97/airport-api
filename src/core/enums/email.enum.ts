import { registerEnumType } from "@nestjs/graphql";



export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}
registerEnumType(EmailStatus, {
  name: 'EmailStatus',
  description: 'The status of the email',
});
