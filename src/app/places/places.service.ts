import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {take, map, tap, delay} from 'rxjs/operators'
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
    [
      new Place(
        'p1',
        'Manhattan Mansion',
        'In the heart of New York City.',
        'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
        149.99,
        new Date('2019-01-01'),
        new Date('2019-12-31'),
        'user1'
      ),
      new Place(
        'p2',
        "L'Amour Toujours",
        'A romantic place in Paris!',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
        189.99,
        new Date('2020-01-01'),
        new Date('2020-12-31'),
        'user2'
      ),
      new Place(
        'p3',
        'The Foggy Palace',
        'Not your average city trip!',
        'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
        99.99,
        new Date('2021-01-01'),
        new Date('2021-12-31'),
        'user1'
      )
    ]
  );

  constructor(private authService: AuthService) {}

  get places() {
    return this._places.asObservable();
  }

  getPlaceById(id: string) {
    return this.places.pipe(
        take(1), 
        map(place => {
            return {...place.find( x => x.id === id)};
        }));
  }

  addPlace(
    title: string, desc: string, price: number,
    availableFrom: Date, availableTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      desc,
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      price,
      availableFrom,
      availableTo,
      this.authService.UserId
    );
    
    return this.places
      .pipe(take(1), delay(1500), tap((places) => {
        this._places.next(places.concat(newPlace));
      }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(1000), tap(places => {
      const updatedPlaceIdx = places.findIndex( p => p.id === placeId);
      const updatedPlace = [...places];
      const old = updatedPlace[updatedPlaceIdx];

      updatedPlace[updatedPlaceIdx] = new Place(
        old.id, 
        title, 
        description,
        old.imageUrl,
        old.price,
        old.availableFrom,
        old.availableTo,
        old.userId
      )

      this._places.next(updatedPlace);
    }));
  }
}
