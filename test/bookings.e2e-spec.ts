import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app.module';
import { Booking } from '../src/bookings/entities/booking.entity';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('Bookings e2e', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer() as unknown as Server;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /bookings', () => {
    it('creates a booking with all required fields', async () => {
      const createDto = {
        flightNumber: 'AA123',
        passengerName: 'John Doe',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createDto)
        .expect(201);

      const booking = response.body as Booking;
      expect(booking.id).toBeDefined();
      expect(booking.flightNumber).toBe('AA123');
      expect(booking.passengerName).toBe('John Doe');
      expect(booking.status).toBe('PENDING');
      expect(booking.createdAt).toBeDefined();
      expect(booking.updatedAt).toBeDefined();
    });

    it('creates a booking with optional seat preference', async () => {
      const createDto = {
        flightNumber: 'BA456',
        passengerName: 'Jane Smith',
        seatPreference: '12A',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createDto)
        .expect(201);

      const booking = response.body as Booking;
      expect(booking.seat).toBe('12A');
    });

    it('returns validation error for missing flightNumber', async () => {
      const createDto = {
        passengerName: 'John Doe',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createDto)
        .expect(400);

      const errorResponse = response.body as ErrorResponse;
      expect(errorResponse.message).toContain(
        'flightNumber should not be empty',
      );
    });

    it('returns validation error for missing passengerName', async () => {
      const createDto = {
        flightNumber: 'AA123',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createDto)
        .expect(400);

      const errorResponse = response.body as ErrorResponse;
      expect(errorResponse.message).toContain(
        'passengerName should not be empty',
      );
    });

    it('returns validation error for invalid data types', async () => {
      const createDto = {
        flightNumber: 123,
        passengerName: 456,
      };

      const response = await request(server)
        .post('/bookings')
        .send(createDto)
        .expect(400);

      const errorResponse = response.body as ErrorResponse;
      expect(Array.isArray(errorResponse.message)).toBe(true);
    });
  });

  describe('GET /bookings', () => {
    it('returns empty array when no bookings exist', async () => {
      const response = await request(server).get('/bookings').expect(200);

      const bookings = response.body as Booking[];
      expect(Array.isArray(bookings)).toBe(true);
      expect(bookings.length).toBe(0);
    });

    it('returns all bookings', async () => {
      await request(server)
        .post('/bookings')
        .send({ flightNumber: 'AA123', passengerName: 'John Doe' });
      await request(server)
        .post('/bookings')
        .send({ flightNumber: 'BA456', passengerName: 'Jane Smith' });

      const response = await request(server).get('/bookings').expect(200);

      const bookings = response.body as Booking[];
      expect(bookings.length).toBe(2);
      expect(bookings[0].flightNumber).toBe('AA123');
      expect(bookings[1].flightNumber).toBe('BA456');
    });
  });

  describe('GET /bookings/:id', () => {
    it('returns a booking by ID', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({ flightNumber: 'AA123', passengerName: 'John Doe' });

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .get(`/bookings/${createdBooking.id}`)
        .expect(200);

      const booking = response.body as Booking;
      expect(booking.id).toBe(createdBooking.id);
      expect(booking.flightNumber).toBe('AA123');
    });

    it('returns 404 for non-existent booking', async () => {
      await request(server).get('/bookings/non-existent-id').expect(404);
    });
  });

  describe('PATCH /bookings/:id/status', () => {
    it('updates booking status to CONFIRMED', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({ flightNumber: 'AA123', passengerName: 'John Doe' });

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'CONFIRMED' })
        .expect(200);

      const updatedBooking = response.body as Booking;
      expect(updatedBooking.status).toBe('CONFIRMED');
      expect(new Date(updatedBooking.updatedAt).getTime()).toBeGreaterThan(
        new Date(createdBooking.updatedAt).getTime(),
      );
    });

    it('updates booking status to CANCELLED', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({ flightNumber: 'AA123', passengerName: 'John Doe' });

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'CANCELLED' })
        .expect(200);

      const updatedBooking = response.body as Booking;
      expect(updatedBooking.status).toBe('CANCELLED');
    });

    it('returns validation error for invalid status', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({ flightNumber: 'AA123', passengerName: 'John Doe' });

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      const errorResponse = response.body as ErrorResponse;
      expect(errorResponse.statusCode).toBe(400);
    });

    it('returns 404 for non-existent booking', async () => {
      await request(server)
        .patch('/bookings/non-existent-id/status')
        .send({ status: 'CONFIRMED' })
        .expect(404);
    });
  });
});
