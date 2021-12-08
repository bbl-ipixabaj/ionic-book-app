import { Component, OnDestroy, OnInit } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonSegmentButton } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  //listedLoadedPlaces: Place[];
  public isLoading = false;
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSubs: Subscription

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces()
    .subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userId !== this.authService.UserId
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }


  ngOnDestroy() {
    if(this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }
}
