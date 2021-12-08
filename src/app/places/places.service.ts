import { Injectable } from '@angular/core';
import { BehaviorSubject, of, scheduled } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {take, map, tap, delay, switchMap} from 'rxjs/operators'
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string,
  availableTo: string,
  description:string,
  imageUrl: string,
  price: number,
  title: string,
  userId: string,
}
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
   []
  );

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
    ) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    // When we dont really know the name of a certain key in js, we can use the following to assist;
    // [key: string]
    return this.httpClient.get<{[key: string]: PlaceData}>(
      'https://iv-places-app-default-rtdb.firebaseio.com/offered-places.json',
    ).pipe(
      map(resData => {
        
        const places = [];
        for(const key in resData) {
          if(resData.hasOwnProperty(key)) {
            console.log(key);
            places.push(new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId
              )
            )
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlaceById(id: string) {
    return this.httpClient.get<PlaceData>(
      `https://iv-places-app-default-rtdb.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(respData => {
        return new Place(
          id,
          respData.title,
          respData.description,
          respData.imageUrl,
          respData.price,
          new Date(respData.availableFrom),
          new Date(respData.availableTo),
          respData.userId
        )
      })
    )
  }

  addPlace(
    title: string, desc: string, price: number,
    availableFrom: Date, availableTo: Date
  ) {
    let generatedId;
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

    return this.httpClient.post<{name: string}>(
      'https://iv-places-app-default-rtdb.firebaseio.com/offered-places.json',
      {
        ...newPlace, id: null
      }
    ).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace))
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlace: Place[];

    return this.places.pipe(
      take(1), 
      switchMap(places => {
        if(!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIdx = places.findIndex( p => p.id === placeId);
        updatedPlace = [...places];
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
        return this.httpClient.put(
          `https://iv-places-app-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          {...updatedPlace[updatedPlaceIdx], id: null}
        )
      }),
      tap(() => {
        this._places.next(updatedPlace);
      })
    )
  }
}
