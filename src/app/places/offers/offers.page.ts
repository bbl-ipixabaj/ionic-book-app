import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers:  Place[];
  private placesSubs: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ngOnInit() {
  }

  resetSlider(slidingItem: IonItemSliding){
    slidingItem.close();
  }

  ngOnDestroy() {
    if(this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }

}
