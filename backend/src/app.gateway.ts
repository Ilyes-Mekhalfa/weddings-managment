import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { AppService } from './app.service';
import { GuestStatus } from './generated/prisma/enums';
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5371',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private appService: AppService) {}

  @SubscribeMessage('guest:update')
  async handleGuestUpdate(
    @MessageBody()
    data: {
      id: number;
      status: GuestStatus;
      invitedBy?: string;
    },
  ) {
    const guest = await this.appService.changeStatus(data.id, {
      status: data.status,
      invitedBy: data.invitedBy,
    });

    this.server.emit('guest:updated', guest);
  }
}
