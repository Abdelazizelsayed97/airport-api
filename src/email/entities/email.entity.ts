import { EmailStatus } from '@core/enums/email.enum';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('emails', {
  synchronize: true,
})
@ObjectType()
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Column()
  from: string;
  @Field()
  @Column()
  to: string;
  @Field()
  @Column({ nullable: true })
  subject?: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  html?: string;

  @Field()
  @Column({ nullable: true })
  templateId?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'json', nullable: true })
  dynamicTemplateData?: Record<string, any>;

  @Field()
  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Field()
  @Column({ type: 'text', nullable: true })
  error?: string;

  @Field()
  @Column({ default: 0 })
  attempts: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
