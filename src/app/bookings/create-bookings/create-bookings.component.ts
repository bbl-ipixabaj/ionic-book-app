import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-bookings',
  templateUrl: './create-bookings.component.html',
  styleUrls: ['./create-bookings.component.scss'],
})
export class CreateBookingsComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', {static: true}) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if(this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() + Math.random() * (
          availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 -
          availableFrom.getTime()
        )
      ).toISOString();

      this.endDate = new Date(new Date(this.startDate).getTime() +
      Math.random() * 
      (new Date(this.startDate).getTime() +
       6 * 24 * 60 * 60 * 1000 - 
      new Date(this.startDate).getTime())).toISOString();
    }
  }

  onBook() {
    if(!this.form.valid || !this.datesValid()){
      console.log('This form is not valid');
      return;
    }
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['firstName'],
        lastName: this.form.value['lastName'],
        guestNumber: +this.form.value['guestNumber'],
        startDate: new Date(this.form.value['date-from']),
        endDate: new Date(this.form.value['date-to']),
      }
    }, 'confirm');
  }

  onCancel () {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);

    return startDate < endDate;
  }
}
