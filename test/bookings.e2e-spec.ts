import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Booking } from '../src/bookings/entities/booking.entity';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('Bookings E2E', () => {
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
    it('should create a booking and return 201', async () => {
      const createBookingDto = {
        flightNumber: 'AA123',
        passengerName: 'John Doe',
        seatPreference: '12A',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      const booking = response.body as Booking;
      expect(booking.id).toBeDefined();
      expect(booking.flightNumber).toBe('AA123');
      expect(booking.passengerName).toBe('John Doe');
      expect(booking.seat).toBe('12A');
      expect(booking.status).toBe('PENDING');
      expect(booking.createdAt).toBeDefined();
      expect(booking.updatedAt).toBeDefined();
    });

    it('should create a booking without seat preference', async () => {
      const createBookingDto = {
        flightNumber: 'BA456',
        passengerName: 'Jane Smith',
      };

      const response = await request(server)
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      const booking = response.body as Booking;
      expect(booking.id).toBeDefined();
      expect(booking.flightNumber).toBe('BA456');
      expect(booking.passengerName).toBe('Jane Smith');
      expect(booking.seat).toBeUndefined();
      expect(booking.status).toBe('PENDING');
    });

    it('should return 400 when flightNumber is missing', async () => {
      const invalidDto = {
        passengerName: 'John Doe',
      };

      const response = await request(server)
        .post('/bookings')
        .send(invalidDto)
        .expect(400);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('flightNumber should not be empty');
    });

    it('should return 400 when passengerName is missing', async () => {
      const invalidDto = {
        flightNumber: 'AA123',
      };

      const response = await request(server)
        .post('/bookings')
        .send(invalidDto)
        .expect(400);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('passengerName should not be empty');
    });

    it('should return 400 when flightNumber is not a string', async () => {
      const invalidDto = {
        flightNumber: 12345,
        passengerName: 'John Doe',
      };

      const response = await request(server)
        .post('/bookings')
        .send(invalidDto)
        .expect(400);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('flightNumber must be a string');
    });
  });

  describe('GET /bookings', () => {
    it('should return empty array when no bookings exist', async () => {
      const response = await request(server).get('/bookings').expect(200);

      const bookings = response.body as Booking[];
      expect(bookings).toEqual([]);
    });

    it('should return all bookings', async () => {
      // Create first booking
      await request(server).post('/bookings').send({
        flightNumber: 'AA123',
        passengerName: 'John Doe',
      });

      // Create second booking
      await request(server).post('/bookings').send({
        flightNumber: 'BA456',
        passengerName: 'Jane Smith',
      });

      const response = await request(server).get('/bookings').expect(200);

      const bookings = response.body as Booking[];
      expect(bookings).toHaveLength(2);
      expect(bookings[0].flightNumber).toBe('AA123');
      expect(bookings[1].flightNumber).toBe('BA456');
    });
  });

  describe('GET /bookings/:id', () => {
    it('should return a booking by id', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .get(`/bookings/${createdBooking.id}`)
        .expect(200);

      const booking = response.body as Booking;
      expect(booking.id).toBe(createdBooking.id);
      expect(booking.flightNumber).toBe('AA123');
      expect(booking.passengerName).toBe('John Doe');
    });

    it('should return 404 when booking does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server)
        .get(`/bookings/${nonExistentId}`)
        .expect(404);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('not found');
    });
  });

  describe('PATCH /bookings/:id/status', () => {
    it('should update booking status to CONFIRMED', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'CONFIRMED' })
        .expect(200);

      const updatedBooking = response.body as Booking;
      expect(updatedBooking.id).toBe(createdBooking.id);
      expect(updatedBooking.status).toBe('CONFIRMED');
      expect(new Date(updatedBooking.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(createdBooking.updatedAt).getTime(),
      );
    });

    it('should update booking status to CANCELLED', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          flightNumber: 'BA456',
          passengerName: 'Jane Smith',
        })
        .expect(201);

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'CANCELLED' })
        .expect(200);

      const updatedBooking = response.body as Booking;
      expect(updatedBooking.status).toBe('CANCELLED');
    });

    it('should return 404 when updating non-existent booking', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server)
        .patch(`/bookings/${nonExistentId}/status`)
        .send({ status: 'CONFIRMED' })
        .expect(404);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('not found');
    });

    it('should return 400 when status is invalid', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(400);
      expect(error.message).toBeDefined();
    });

    it('should return 400 when status is missing', async () => {
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const createdBooking = createResponse.body as Booking;

      const response = await request(server)
        .patch(`/bookings/${createdBooking.id}/status`)
        .send({})
        .expect(400);

      const error = response.body as ErrorResponse;
      expect(error.statusCode).toBe(400);
      expect(error.message).toBeDefined();
    });
  });
});
