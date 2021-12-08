import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  public isBookable = false;
  private placeSubs: Subscription;
  public isLoading: boolean = false;
  // TODO: Add id extraction after navigating to page. Do for edit page as well 
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheet: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placeSubs = this.placeService
        .getPlaceById(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.UserId;
          this.isLoading = false;
        },
        err => {
          this.alertCtrl.create({
            header: 'An error occured',
            message: 'The application wan unable to retrieve a page. Please try again later',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/discover'])
              }
            }]
          }).then(alertEl => {
            alertEl.present();
          })
        });
    });
  }

  onBookPlace() {
    //this.router.navigateByUrl('/places/tabs/discover');
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheet.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    })
    .then( sheetElement => {
      sheetElement.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {

    this.modalCtrl.create({
      component: CreateBookingsComponent, 
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    })
    .then(data => {
      data.present();
      return data.onDidDismiss();
    })
    .then( result => {
      console.log(result.data, result.role);
      if(result.role === 'confirm'){
        this.loadingCtrl.create({message: 'Booking Place...'})
        .then(loadingElement => {
          loadingElement.present();
            const data = result.data.bookingData;

            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              data.guestNumber,
              data.startDate,
              data.endDate
            ).subscribe(() => {
              console.log('subscribed to add booking');
              loadingElement.dismiss();
            })
        })
      }
    })
  }

  ngOnDestroy() {
    if(this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
