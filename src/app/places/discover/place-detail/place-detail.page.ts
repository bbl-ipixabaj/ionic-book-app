import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  // TODO: Add id extraction after navigating to page. Do for edit page as well 
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheet: ActionSheetController,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placeService.getPlaceById(paramMap.get('placeId'));
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
        alert('booked');
      }
    })
  }

}
