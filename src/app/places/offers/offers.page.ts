import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers:  Place[];

  constructor(private placesService: PlacesService) {
    this.offers = this.placesService.places;
  }

  ngOnInit() {
  }

  resetSlider(slidingItem: IonItemSliding){
    slidingItem.close();
  }

}
