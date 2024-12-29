import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger: Logger = new Logger('MailService');
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
}
