import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GuestStatus, GuestType } from './generated/prisma/enums';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
  ) {}

  @Get()
  async getAllGuests() {
    return await this.appService.getAllGuests();
  }

  @Post('guest')
  async addGuest(
    @Body()
    data: {
      name: string;
      type: GuestType;
      status?: GuestStatus;
      invitedBy?: string;
    },
  ) {
    const guest = await this.appService.addGuest(data);
    this.appGateway?.server?.emit('guest:created', guest);
    return guest;
  }

  @Post()
  async addGuests(@Body() data: any) {
    if (data && data.name && data.type) {
      const guest = await this.appService.addGuest(data);
      this.appGateway?.server?.emit('guest:created', guest);
      return guest;
    }
    return await this.appService.addGuests(data);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: { status: GuestStatus; invitedBy: string },
  ) {
    return await this.appService.changeStatus(id, data);
  }
}
