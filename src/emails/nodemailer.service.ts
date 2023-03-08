import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class NodeMailerService implements EmailService {}
