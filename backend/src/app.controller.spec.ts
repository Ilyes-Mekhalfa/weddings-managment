import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { GuestStatus, GuestType } from './generated/prisma/enums';

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: any;
  let mockAppGateway: any;

  beforeEach(() => {
    mockAppService = {
      getAllGuests: jest.fn().mockResolvedValue({
        guests: [],
        countTotal: 0,
        pending: 0,
        invited: 0,
      }),
      addGuest: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: 1,
          ...data,
          status: GuestStatus.PENDING,
          invitedBy: null,
        }),
      ),
      addGuests: jest.fn().mockResolvedValue({ count: 1 }),
      changeStatus: jest.fn(),
    };

    mockAppGateway = {
      server: {
        emit: jest.fn(),
      },
    };

    appController = new AppController(
      mockAppService as unknown as AppService,
      mockAppGateway as unknown as AppGateway,
    );
  });

  describe('getAllGuests', () => {
    it('should return all guests and counts', async () => {
      const result = await appController.getAllGuests();
      expect(result.countTotal).toBe(0);
      expect(mockAppService.getAllGuests).toHaveBeenCalled();
    });
  });

  describe('addGuest', () => {
    it('should create a guest and emit websocket event', async () => {
      const newGuestData = {
        name: 'أحمد علي',
        type: GuestType.FAMILY,
      };

      const result = await appController.addGuest(newGuestData);
      expect(result.name).toBe('أحمد علي');
      expect(mockAppService.addGuest).toHaveBeenCalledWith(newGuestData);
      expect(mockAppGateway.server.emit).toHaveBeenCalledWith(
        'guest:created',
        expect.objectContaining({ name: 'أحمد علي' }),
      );
    });
  });
});
