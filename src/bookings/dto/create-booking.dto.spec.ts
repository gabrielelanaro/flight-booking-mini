import { validate } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

describe('CreateBookingDto', () => {
  let dto: CreateBookingDto;

  beforeEach(() => {
    dto = new CreateBookingDto();
    dto.passengerName = 'John Doe';
    dto.flightNumber = 'UA123';

    // Use a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    dto.departureDate = futureDate.toISOString().split('T')[0];
  });

  describe('passengerName validation', () => {
    it('should pass with valid passenger name', async () => {
      dto.passengerName = 'John Doe';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty passenger name', async () => {
      dto.passengerName = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('passengerName');
    });

    it('should fail with passenger name containing numbers', async () => {
      dto.passengerName = 'John Doe 123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with passenger name too long', async () => {
      dto.passengerName = 'A'.repeat(101);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('passengerName');
    });
  });

  describe('flightNumber validation', () => {
    it('should pass with valid flight number', async () => {
      dto.flightNumber = 'UA123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with valid flight number and suffix', async () => {
      dto.flightNumber = 'UA456-1';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty flight number', async () => {
      dto.flightNumber = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('flightNumber');
    });

    it('should fail with invalid flight number format', async () => {
      dto.flightNumber = 'INVALID';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('flightNumber');
    });

    it('should fail with flight number too short', async () => {
      dto.flightNumber = 'F1';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('flightNumber');
    });
  });

  describe('departureDate validation', () => {
    it('should pass with valid future date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      dto.departureDate = futureDate.toISOString().split('T')[0];

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with past date', async () => {
      dto.departureDate = '2020-12-25';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('departureDate');
    });

    it('should fail with invalid date format', async () => {
      dto.departureDate = '25-12-2024';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('departureDate');
    });

    it('should fail with empty departure date', async () => {
      dto.departureDate = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('departureDate');
    });
  });

  describe('returnDate validation', () => {
    it('should pass with valid return date after departure', async () => {
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 7);
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      dto.departureDate = departureDate.toISOString().split('T')[0];
      dto.returnDate = returnDate.toISOString().split('T')[0];

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass without return date', async () => {
      dto.returnDate = undefined;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with return date before departure', async () => {
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 14);
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 7);

      dto.departureDate = departureDate.toISOString().split('T')[0];
      dto.returnDate = returnDate.toISOString().split('T')[0];

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid return date format', async () => {
      dto.returnDate = '30-12-2024';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
