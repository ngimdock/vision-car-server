import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor() {
    console.log('je suis dev nodejs..');
  }
  onModuleInit() {
    console.log('hello world !');
    console.log('hello world moi je suis dan !');
  }
}
