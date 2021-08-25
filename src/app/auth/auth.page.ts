import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoggedIn: Boolean;
  isLoading: boolean = false;;
  isLogin: boolean;

  constructor(private authService: AuthService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: "Logging In"
    })
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        this.loadingCtrl.dismiss();
        this.authService.login();
      }, 1500);
    });
  }
  
  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.pw;
    console.log(email, password);
    if(this.isLoggedIn){
      
      // redirect to login servers
    } else {
      //refirect to sign up page
    }
    this.authService.login();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
