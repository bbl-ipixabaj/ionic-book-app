import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading = false;
  private placeSubs: Subscription;
  placeId: string;

  constructor(
    private placeService: PlacesService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSubs = this.placeService.getPlaceById(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
          });
          this.isLoading = false;
        }, err => {
          this.alertCtrl.create({
            header: 'An error occured',
            message: 'Place could not be fetched. Please try again later or contact us at 6678932 for further support.',
            buttons: [{text: 'Okay', handler: () => {
              this.router.navigate(['/places/tabs/offers'])
            }}]
          })
          .then(alertEl => {
            alertEl.present();
          })
        });
    });
  }

  onSaveEdit(){
    if(!this.form.valid){
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Place',
    }).then(loader => {
      loader.present();

      this.placeService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        loader.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      })
    })
  }

  ngOnDestroy() {
    if(this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }

}
