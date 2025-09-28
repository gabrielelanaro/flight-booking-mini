import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { Booking } from '../src/bookings/entities/booking.entity';

describe('Bookings e2e', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as unknown as Server;
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a booking and returns confirmation', () => {
    return supertest(server)
      .post('/bookings')
      .send({
        flightNumber: 'AA123',
        passengerName: 'John Doe',
        seatPreference: 'window',
      })
      .expect(201)
      .expect((res) => {
        const booking = res.body as Booking;
        expect(booking.id).toBeDefined();
        expect(booking.flightNumber).toBe('AA123');
        expect(booking.passengerName).toBe('John Doe');
        expect(booking.seat).toBe('window');
        expect(booking.status).toBe('PENDING');
        expect(booking.createdAt).toBeDefined();
        expect(booking.updatedAt).toBeDefined();
      });
  });

  it('lists all bookings', () => {
    return supertest(server)
      .get('/bookings')
      .expect(200)
      .expect((res) => {
        const bookings = res.body as Booking[];
        expect(Array.isArray(bookings)).toBe(true);
      });
  });

  it('gets a booking by id', () => {
    let bookingId: string;

    return supertest(server)
      .post('/bookings')
      .send({
        flightNumber: 'DL456',
        passengerName: 'Jane Smith',
      })
      .expect(201)
      .expect((res) => {
        const booking = res.body as Booking;
        bookingId = booking.id;
      })
      .then(() => {
        return supertest(server)
          .get(`/bookings/${bookingId}`)
          .expect(200)
          .expect((res) => {
            const booking = res.body as Booking;
            expect(booking.id).toBe(bookingId);
            expect(booking.flightNumber).toBe('DL456');
            expect(booking.passengerName).toBe('Jane Smith');
          });
      });
  });

  it('updates booking status', () => {
    let bookingId: string;

    return supertest(server)
      .post('/bookings')
      .send({
        flightNumber: 'UA789',
        passengerName: 'Bob Johnson',
      })
      .expect(201)
      .expect((res) => {
        const booking = res.body as Booking;
        bookingId = booking.id;
      })
      .then(() => {
        return supertest(server)
          .patch(`/bookings/${bookingId}/status`)
          .send({ status: 'CONFIRMED' })
          .expect(200)
          .expect((res) => {
            const booking = res.body as Booking;
            expect(booking.id).toBe(bookingId);
            expect(booking.status).toBe('CONFIRMED');
          });
      });
  });

  it('returns 404 for non-existent booking', () => {
    return supertest(server).get('/bookings/non-existent-id').expect(404);
  });
});
