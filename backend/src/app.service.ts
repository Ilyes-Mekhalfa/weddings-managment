import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GuestStatus, GuestType } from './generated/prisma/enums';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getAllGuests() {
    const [guests, countTotal, pending, invited] =
      await this.prisma.$transaction([
        this.prisma.guest.findMany({
          orderBy: {
            id: 'desc',
          },
        }),
        this.prisma.guest.count(),
        this.prisma.guest.count({
          where: {
            status: GuestStatus.PENDING,
          },
        }),
        this.prisma.guest.count({
          where: {
            status: GuestStatus.INVITED,
          },
        }),
      ]);
    return { guests, countTotal, pending, invited };
  }

  async addGuest(data: {
    name: string;
    type: GuestType;
    status?: GuestStatus;
    invitedBy?: string;
  }) {
    return await this.prisma.guest.create({
      data: {
        name: data.name.trim(),
        type: data.type,
        status: data.status ?? GuestStatus.PENDING,
        invitedBy: data.invitedBy ?? null,
      },
    });
  }

  async addGuests(data: any): Promise<any> {
    console.log(data);
    const res = await this.prisma.guest.createMany({
      data: data.guests,
    });
    console.log(res);
    return res;
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
