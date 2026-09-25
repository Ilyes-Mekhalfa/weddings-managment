import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { AppService } from './app.service';
import { GuestStatus, GuestType } from './generated/prisma/enums';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private appService: AppService) {}

  @SubscribeMessage('guest:add')
  async handleGuestAdd(
    @MessageBody()
    data: {
      name: string;
      type: GuestType;
      status?: GuestStatus;
      invitedBy?: string;
    },
  ) {
    const guest = await this.appService.addGuest(data);
    this.server.emit('guest:created', guest);
    return guest;
  }

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
