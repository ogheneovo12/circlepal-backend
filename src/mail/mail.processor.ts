import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { WorkerHostProcessor } from 'src/common/processors/worker-host.processor';
import { GenericError } from 'src/common/errors';
import { MailService } from './mail.service';
import Queues from 'src/common/constants/queues.constants';

export const emailJobKeys = {};

@Processor(Queues.SendMail)
@Injectable()
export class EmailProcessor extends WorkerHostProcessor {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
    }
    throw new GenericError(`Unknown job name: ${job.name}`);
  }
}
