import { Injectable } from '@nestjs/common';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsRepository {
  private readonly store: Booking[] = [];

  findAll(): Booking[] {
    return this.store;
  }

  findById(id: string): Booking | undefined {
    return this.store.find((booking) => booking.id === id);
  }

  create(_payload: Partial<Booking>): Booking {
    // Repository logic will be added during the demo.
    throw new Error('create repository method not implemented');
  }

  updateStatus(_id: string, _status: Booking['status']): Booking {
    throw new Error('update repository method not implemented');
  }
}
