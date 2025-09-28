import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { BookingsModule } from '../src/bookings/bookings.module';

describe('Bookings e2e', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookingsModule],
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
    it('creates a booking and returns confirmation', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      const createBookingDto = {
        passengerName: 'John Doe',
        flightNumber: 'UA123',
        departureDate: futureDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
      };

      const response = await request(server)
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      const booking = response.body as Record<string, unknown>;
      expect(booking).toHaveProperty('id');
      expect(booking.passengerName).toBe(createBookingDto.passengerName);
      expect(booking.flightNumber).toBe(createBookingDto.flightNumber);
      expect(booking.departureDate).toBe(createBookingDto.departureDate);
      expect(booking.returnDate).toBe(createBookingDto.returnDate);
      expect(booking.status).toBe('pending');
      expect(booking).toHaveProperty('createdAt');
      expect(booking).toHaveProperty('updatedAt');
    });

    it('returns 400 for invalid booking data', async () => {
      const invalidBookingDto = {
        passengerName: '', // Invalid: empty name
        flightNumber: 'INVALID', // Invalid: wrong format
        departureDate: '2020-12-25', // Invalid: past date
      };

      await request(server)
        .post('/bookings')
        .send(invalidBookingDto)
        .expect(400);
    });
  });

  describe('GET /bookings', () => {
    it('returns empty array when no bookings exist', async () => {
      const response = await request(server).get('/bookings').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('returns all bookings when multiple exist', async () => {
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 7);
      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 14);

      // Create first booking
      await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate1.toISOString().split('T')[0],
        });

      // Create second booking
      await request(server)
        .post('/bookings')
        .send({
          passengerName: 'Jane Smith',
          flightNumber: 'UA456',
          departureDate: futureDate2.toISOString().split('T')[0],
        });

      const response = await request(server).get('/bookings').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      const bookings = response.body as Record<string, unknown>[];
      expect(bookings[0].passengerName).toBe('John Doe');
      expect(bookings[1].passengerName).toBe('Jane Smith');
    });
  });

  describe('GET /bookings/:id', () => {
    it('returns booking by ID when it exists', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createResponse = await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate.toISOString().split('T')[0],
        });

      const booking = createResponse.body as Record<string, unknown>;
      const bookingId = booking.id as string;

      const response = await request(server)
        .get(`/bookings/${bookingId}`)
        .expect(200);

      const responseBody = response.body as Record<string, unknown>;
      expect(responseBody.id).toBe(bookingId);
      expect(responseBody.passengerName).toBe('John Doe');
    });

    it('returns 404 when booking does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      await request(server).get(`/bookings/${nonExistentId}`).expect(404);
    });

    it('returns 400 when ID is not a valid UUID', async () => {
      await request(server).get('/bookings/invalid-uuid').expect(400);
    });
  });

  describe('PATCH /bookings/:id/status', () => {
    it('updates booking status successfully', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createResponse = await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate.toISOString().split('T')[0],
        });

      const booking = createResponse.body as Record<string, unknown>;
      const bookingId = booking.id as string;

      const updateResponse = await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      const updateResponseBody = updateResponse.body as Record<string, unknown>;
      expect(updateResponseBody.status).toBe('confirmed');
      expect(updateResponseBody.updatedAt).not.toBe(booking.updatedAt);
    });

    it('returns 400 for invalid status update', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createResponse = await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate.toISOString().split('T')[0],
        });

      const booking = createResponse.body as Record<string, unknown>;
      const bookingId = booking.id as string;

      await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'invalid' })
        .expect(400);
    });

    it('returns 404 when booking does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      await request(server)
        .patch(`/bookings/${nonExistentId}/status`)
        .send({ status: 'confirmed' })
        .expect(404);
    });

    it('returns 409 when invalid status transition', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createResponse = await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate.toISOString().split('T')[0],
        });

      const booking = createResponse.body as Record<string, unknown>;
      const bookingId = booking.id as string;

      // Cancel booking
      await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'cancelled' })
        .expect(200);

      // Try to confirm cancelled booking
      await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'confirmed' })
        .expect(409);
    });
  });

  describe('Complete Booking Lifecycle', () => {
    it('handles complete booking workflow', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      // Create booking
      const createResponse = await request(server)
        .post('/bookings')
        .send({
          passengerName: 'Alice Johnson',
          flightNumber: 'DL789',
          departureDate: futureDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
        })
        .expect(201);

      const booking = createResponse.body as Record<string, unknown>;
      const bookingId = booking.id as string;

      // Complete status transition workflow
      await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      await request(server)
        .patch(`/bookings/${bookingId}/status`)
        .send({ status: 'cancelled' })
        .expect(200);

      // Verify workflow completion
      const finalResponse = await request(server)
        .get(`/bookings/${bookingId}`)
        .expect(200);

      expect((finalResponse.body as Record<string, unknown>).status).toBe('cancelled');
    });
  });

  describe('Data Persistence', () => {
    it('clears data when application restarts', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      // Create a booking
      await request(server)
        .post('/bookings')
        .send({
          passengerName: 'John Doe',
          flightNumber: 'UA123',
          departureDate: futureDate.toISOString().split('T')[0],
        })
        .expect(201);

      // Verify booking exists
      const listResponse = await request(server).get('/bookings').expect(200);

      expect(listResponse.body).toHaveLength(1);

      // Note: In a real test, we would restart the application here
      // For this demo, we're testing the in-memory nature by verifying
      // that each test gets a clean state (which is handled by beforeEach)
    });
  });
});
