import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController, 
    private placeService: PlacesService) 
    { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      console.log(paramMap.get('placeId'));
      this.placeSubs = this.placeService.getPlaceById(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
        });
    });
  }

  ngOnDestroy() {
    if(this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
