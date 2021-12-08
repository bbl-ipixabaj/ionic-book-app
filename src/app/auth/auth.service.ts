import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated: boolean = true;
  private _userId: string = 'user2';

  constructor(private router: Router) { }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get UserId() {
    return this._userId;
  }

  login() {
    this._userIsAuthenticated = true;
    this.router.navigateByUrl('/places/tabs/discover');
  }

  logout() {
    this._userIsAuthenticated = false;
    this.router.navigateByUrl('/auth');
  }
}
