import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GuestStatus } from './generated/prisma/enums';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllGuests() {
    return await this.appService.getAllGuests();
  }

  @Post()
  async addGuests(@Body() data: any) {
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
