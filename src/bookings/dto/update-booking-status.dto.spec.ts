import { validate } from 'class-validator';
import { UpdateBookingStatusDto } from './update-booking-status.dto';

describe('UpdateBookingStatusDto', () => {
  let dto: UpdateBookingStatusDto;

  beforeEach(() => {
    dto = new UpdateBookingStatusDto();
  });

  describe('status validation', () => {
    it('should pass with valid status values', async () => {
      const validStatuses = ['pending', 'confirmed', 'cancelled'];

      for (const status of validStatuses) {
        dto.status = status;
        const errors = await validate(dto);
        expect(errors.length).toBe(0, `Should pass with status: ${status}`);
      }
    });

    it('should fail with empty status', async () => {
      dto.status = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should fail with invalid status value', async () => {
      dto.status = 'invalid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should fail with numeric status', async () => {
      dto.status = '123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should fail with null status', async () => {
      dto.status = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should fail with undefined status', async () => {
      dto.status = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });
  });
});
