import { Test, TestingModule } from '@nestjs/testing';
import { BookingsRepository } from './bookings.repository';

describe('BookingsRepository', () => {
  let repository: BookingsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsRepository],
    }).compile();

    repository = module.get<BookingsRepository>(BookingsRepository);
  });

  describe('findAll', () => {
    it('should return empty array when no bookings exist', () => {
      const result = repository.findAll();
      expect(result).toEqual([]);
    });

    it('should return all bookings when multiple exist', () => {
      // Create some test bookings first
      const createBookingDto1 = {
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
      };
      const createBookingDto2 = {
        passengerName: 'Jane Smith',
        flightNumber: 'UA456',
        departureDate: '2024-12-26',
      };

      const booking1 = repository.create(createBookingDto1);
      const booking2 = repository.create(createBookingDto2);

      const result = repository.findAll();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(booking1);
      expect(result).toContainEqual(booking2);
    });
  });

  describe('findById', () => {
    it('should return undefined when booking does not exist', () => {
      const result = repository.findById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should return booking when it exists', () => {
      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
      };

      const booking = repository.create(createBookingDto);
      const result = repository.findById(booking.id);

      expect(result).toBe(booking);
    });
  });

  describe('create', () => {
    it('should create a new booking with generated ID', () => {
      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
        returnDate: '2024-12-30',
      };

      const booking = repository.create(createBookingDto);

      expect(booking.id).toBeDefined();
      expect(booking.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(booking.passengerName).toBe(createBookingDto.passengerName);
      expect(booking.flightNumber).toBe(createBookingDto.flightNumber);
      expect(booking.departureDate).toBe(createBookingDto.departureDate);
      expect(booking.returnDate).toBe(createBookingDto.returnDate);
      expect(booking.status).toBe('pending');
      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate UUID for new booking', () => {
      const createBookingDto = {
        passengerName: 'Jane Smith',
        flightNumber: 'UA456',
        departureDate: '2024-12-26',
      };

      const booking1 = repository.create(createBookingDto);
      const booking2 = repository.create(createBookingDto);

      expect(booking1.id).not.toBe(booking2.id);
      expect(booking1.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(booking2.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update booking status when booking exists', () => {
      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
      };

      const booking = repository.create(createBookingDto);

      const updatedBooking = repository.updateStatus(booking.id, 'confirmed');

      expect(updatedBooking.status).toBe('confirmed');
      expect(updatedBooking.id).toBe(booking.id);
      expect(updatedBooking.updatedAt.getTime()).toBeGreaterThanOrEqual(
        booking.updatedAt.getTime(),
      );
    });

    it('should throw error when booking does not exist', () => {
      expect(() =>
        repository.updateStatus('non-existent-id', 'confirmed'),
      ).toThrow('Booking not found');
    });
  });
});
