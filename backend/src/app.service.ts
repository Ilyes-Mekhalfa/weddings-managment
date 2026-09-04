import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GuestStatus } from './generated/prisma/enums';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getAllGuests() {
    return await this.prisma.guest.findMany({});
  }

  async addGuests(data: any){
    const guests = data.guests
    return await this.prisma.guest.createMany({
      data: guests
    })
  }

  async changeStatus(
    id: number,
    data: {
      status: GuestStatus;
      invitedBy?: string;
    },
  ) {
    return await this.prisma.guest.update({
      where: {
        id,
      },
      data: {
        status: data.status,
        invitedBy: data.status === GuestStatus.INVITED ? data.invitedBy : null,
      },
    });
  }
}
