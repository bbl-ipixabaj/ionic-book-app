import {Injectable} from "@angular/core";

import {Booking} from './booking.model';

@Injectable({providedIn: 'root'})
export class BookingService {
    private _bookings: Booking[] = [
        {
            id: 'xxyzz',
            placeId: 'p1',
            placeTitle: 'BMP Apartments',
            guestNumber: 2,
            publicUserId: 'ABC'
        }
    ];

    get bookings() {
        return [...this._bookings];
    }
}