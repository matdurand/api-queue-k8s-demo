import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('messages') private messagesQueue: Queue) {}

  async processMessage(message: unknown): Promise<void> {
    console.log('Processing message', message);
    await this.messagesQueue.add(message);
  }
}
