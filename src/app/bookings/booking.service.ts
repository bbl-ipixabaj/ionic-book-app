import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

import {Booking} from './booking.model';

interface BookingResp {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImg: string;
    placeTitle: string;
    userId: string;
}
@Injectable({providedIn: 'root'})
export class BookingService {

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient
        ){}
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string, 
        placeTitle: string, 
        placeImg: string, 
        firstName: string, 
        lastName: string, 
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date,
    ) {
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.UserId,
            placeTitle,
            placeImg,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        let generatedId: string;

        return this.httpClient.post<{name: string}>(
            'https://iv-places-app-default-rtdb.firebaseio.com/bookings.json',
            {
                ...newBooking,
                id: null
            }
        ).pipe(
            switchMap(resData => {
                generatedId = resData.name;
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                newBooking.id = generatedId;
                this._bookings.next(bookings.concat(newBooking));
            })
        );
    }

    fetchBookings() {
        return this.httpClient.get<{[key: string]: BookingResp}>(
            `https://iv-places-app-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.UserId}"`
        ).pipe(
            map(bookingsData => {
                const bookings = [];
                for(const key in bookingsData) {
                    if(bookingsData.hasOwnProperty(key)){
                        bookings.push(new Booking(
                                key,
                                bookingsData[key].placeId,
                                bookingsData[key].userId,
                                bookingsData[key].placeTitle,
                                bookingsData[key].placeImg,
                                bookingsData[key].firstName,
                                bookingsData[key].lastName,
                                bookingsData[key].guestNumber,
                                new Date(bookingsData[key].bookedFrom),
                                new Date(bookingsData[key].bookedTo)
                            )
                        )
                    }
                }
                return bookings;
            }),
            tap(bookings => {
                this._bookings.next(bookings);
            })
        )
    }

    cancelBooking(bookingId: string) {
        return this.httpClient.delete(
            `https://iv-places-app-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
        ).pipe(
            switchMap(() => {
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                this._bookings.next(bookings.filter(val => val.id !== bookingId));
            })
        );
    }
}