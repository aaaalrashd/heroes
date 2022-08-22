import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenGetter} from '../../shared/tokenGetter';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, public jwtHelper: JwtHelperService) {
  }

  role: string;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    localStorage.getItem('token');
    if (localStorage.getItem('token')) {
      this.role = this.jwtHelper.decodeToken(TokenGetter()).role;
    } else {
      console.log(this.role);
    }
    if (!this.role) {
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotAuthenticationGuard implements CanActivate {
  role: string;

  constructor(private router: Router, public jwtHelper: JwtHelperService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    localStorage.getItem('token');
    if (localStorage.getItem('token')) {
      this.role = this.jwtHelper.decodeToken(TokenGetter()).role;

    } else {
    }
    if (!this.role || this.role == null) {
      return true;
    } else {

      return false;
    }
  }
}


