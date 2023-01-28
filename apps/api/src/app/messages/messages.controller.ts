import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Get()
  getMessages(@Query() param) {
    console.log(param);

    return this.messagesService.getMessages(param);
  }
  @Post()
  createMessage(@Body() body) {
    this.messagesService.createMessage(body);
  }
}
