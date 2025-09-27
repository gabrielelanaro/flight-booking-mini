import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as express from 'express';
import { AppModule } from '../src/app.module';
import { Booking } from '../src/bookings/entities/booking.entity';
import request from 'supertest';

describe('Bookings e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /bookings', () => {
    it('creates a booking with valid input', async () => {
      const createBookingDto = {
        flightNumber: 'AA123',
        passengerName: 'John Doe',
        seatPreference: '12A',
      };

      const response = await request(app.getHttpServer() as express.Application)
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      const booking = response.body as Booking;
      expect(booking).toHaveProperty('id');
      expect(booking.flightNumber).toBe(createBookingDto.flightNumber);
      expect(booking.passengerName).toBe(createBookingDto.passengerName);
      expect(booking.seat).toBe(createBookingDto.seatPreference);
      expect(booking.status).toBe('PENDING');
      expect(booking).toHaveProperty('createdAt');
      expect(booking).toHaveProperty('updatedAt');
    });

    it('rejects booking with missing flightNumber', async () => {
      await request(app.getHttpServer() as express.Application)
        .post('/bookings')
        .send({ passengerName: 'John Doe' })
        .expect(400);
    });

    it('rejects booking with missing passengerName', async () => {
      await request(app.getHttpServer() as express.Application)
        .post('/bookings')
        .send({ flightNumber: 'AA123' })
        .expect(400);
    });

    it('rejects booking with empty body', async () => {
      await request(app.getHttpServer() as express.Application)
        .post('/bookings')
        .send({})
        .expect(400);
    });
  });

  describe('GET /bookings', () => {
    it('returns empty array when no bookings exist', async () => {
      const response = await request(app.getHttpServer() as express.Application)
        .get('/bookings')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns all created bookings', async () => {
      // Create first booking
      const firstBookingResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
          seatPreference: '12A',
        })
        .expect(201);

      const firstBooking = firstBookingResponse.body as Booking;

      // Create second booking
      const secondBookingResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .post('/bookings')
        .send({
          flightNumber: 'BA456',
          passengerName: 'Jane Smith',
          seatPreference: '15B',
        })
        .expect(201);

      const secondBooking = secondBookingResponse.body as Booking;

      const response = await request(app.getHttpServer() as express.Application)
        .get('/bookings')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(firstBooking),
          expect.objectContaining(secondBooking),
        ]),
      );
    });
  });

  describe('GET /bookings/:id', () => {
    it('returns booking by id', async () => {
      const createResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const booking = createResponse.body as Booking;

      const response = await request(app.getHttpServer() as express.Application)
        .get(`/bookings/${booking.id}`)
        .expect(200);

      expect(response.body).toEqual(booking);
    });

    it('returns 404 for non-existent booking', async () => {
      await request(app.getHttpServer() as express.Application)
        .get('/bookings/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /bookings/:id/status', () => {
    it('updates booking status successfully', async () => {
      // Create a booking first
      const createResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const originalBooking = createResponse.body as Booking;

      // Add small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Update status to CONFIRMED
      const updateResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .patch(`/bookings/${originalBooking.id}/status`)
        .send({ status: 'CONFIRMED' })
        .expect(200);

      const updatedBooking = updateResponse.body as Booking;
      expect(updatedBooking.status).toBe('CONFIRMED');
      expect(updatedBooking.updatedAt).not.toBe(originalBooking.updatedAt);
      expect(updatedBooking.id).toBe(originalBooking.id);
    });

    it('returns 404 for non-existent booking', async () => {
      await request(app.getHttpServer() as express.Application)
        .patch('/bookings/non-existent-id/status')
        .send({ status: 'CANCELLED' })
        .expect(404);
    });

    it('rejects invalid status values', async () => {
      // First create a booking to have a valid ID
      const createResponse = await request(
        app.getHttpServer() as express.Application,
      )
        .post('/bookings')
        .send({
          flightNumber: 'AA123',
          passengerName: 'John Doe',
        })
        .expect(201);

      const booking = createResponse.body as Booking;

      await request(app.getHttpServer() as express.Application)
        .patch(`/bookings/${booking.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });
  });
});

async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
