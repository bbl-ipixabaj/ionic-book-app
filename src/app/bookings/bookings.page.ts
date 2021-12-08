import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private bookingSubs: Subscription;
  public isLoading: boolean = false;
  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.bookingSubs = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slider: IonItemSliding) {
    slider.close();
    this.loadingCtrl.create({message: 'Cancelling booking'})
    .then( loadingEl => {
      loadingEl.present();

      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    })
  }

  ngOnDestroy() {
    if(this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }
}
