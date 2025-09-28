import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { Booking, BookingStatus } from './entities/booking.entity';

// Mock repository
const mockBookingsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: BookingsRepository,
          useValue: mockBookingsRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a new booking successfully', () => {
      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'FL123',
        departureDate: '2024-12-25',
        returnDate: '2024-12-30',
      };

      const mockBooking: Booking = {
        id: 'test-uuid',
        passengerName: 'John Doe',
        flightNumber: 'FL123',
        departureDate: '2024-12-25',
        returnDate: '2024-12-30',
        status: 'pending' as BookingStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBookingsRepository.create.mockReturnValue(mockBooking);

      const result = service.createBooking(createBookingDto);

      expect(result).toBe(mockBooking);
      expect(mockBookingsRepository.create).toHaveBeenCalledWith(
        createBookingDto,
      );
    });

    it('should handle repository errors', () => {
      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'FL123',
        departureDate: '2024-12-25',
      };

      mockBookingsRepository.create.mockImplementation(() => {
        throw new Error('Repository error');
      });

      expect(() => service.createBooking(createBookingDto)).toThrow(
        'Repository error',
      );
    });
  });

  describe('findAllBookings', () => {
    it('should return all bookings', () => {
      const mockBookings: Booking[] = [
        {
          id: 'test-uuid-1',
          passengerName: 'John Doe',
          flightNumber: 'FL123',
          departureDate: '2024-12-25',
          status: 'pending' as BookingStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'test-uuid-2',
          passengerName: 'Jane Smith',
          flightNumber: 'UA456',
          departureDate: '2024-12-26',
          status: 'confirmed' as BookingStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBookingsRepository.findAll.mockReturnValue(mockBookings);

      const result = service.findAllBookings();

      expect(result).toBe(mockBookings);
      expect(mockBookingsRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no bookings exist', () => {
      mockBookingsRepository.findAll.mockReturnValue([]);

      const result = service.findAllBookings();

      expect(result).toEqual([]);
      expect(mockBookingsRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findBookingById', () => {
    it('should return booking when it exists', () => {
      const mockBooking: Booking = {
        id: 'test-uuid',
        passengerName: 'John Doe',
        flightNumber: 'FL123',
        departureDate: '2024-12-25',
        status: 'pending' as BookingStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBookingsRepository.findById.mockReturnValue(mockBooking);

      const result = service.findBookingById('test-uuid');

      expect(result).toBe(mockBooking);
      expect(mockBookingsRepository.findById).toHaveBeenCalledWith('test-uuid');
    });
  });

  describe('updateBookingStatus', () => {
    it('should update booking status successfully', () => {
      const mockBooking: Booking = {
        id: 'test-uuid',
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
        status: 'pending' as BookingStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedBooking: Booking = {
        ...mockBooking,
        status: 'confirmed' as BookingStatus,
        updatedAt: new Date(),
      };

      mockBookingsRepository.findById.mockReturnValue(mockBooking);
      mockBookingsRepository.updateStatus.mockReturnValue(updatedBooking);

      const updateDto = { status: 'confirmed' };
      const result = service.updateBookingStatus('test-uuid', updateDto);

      expect(result).toBe(updatedBooking);
      expect(mockBookingsRepository.findById).toHaveBeenCalledWith('test-uuid');
      expect(mockBookingsRepository.updateStatus).toHaveBeenCalledWith(
        'test-uuid',
        'confirmed',
      );
    });

    it('should validate status transitions', () => {
      const mockBooking: Booking = {
        id: 'test-uuid',
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: '2024-12-25',
        status: 'cancelled' as BookingStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBookingsRepository.findById.mockReturnValue(mockBooking);
      mockBookingsRepository.updateStatus.mockImplementation(() => {
        throw new Error('Invalid status transition');
      });

      const updateDto = { status: 'confirmed' };
      expect(() => service.updateBookingStatus('test-uuid', updateDto)).toThrow(
        'Cannot transition booking from cancelled to confirmed',
      );
    });
  });
});
