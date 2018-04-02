import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "../services/auth.service";
//import { FlashMessagesService } from "angular2-flash-messages";

@Injectable()
export class AuthGuard implements CanActivate {
  redirectUrl;
  constructor(
      private authService: AuthService,
      private router: Router
      //private flashMessagesService: FlashMessagesService
      ){}

  canActivate(
      router: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ){
      if(this.authService.loggedIn()){
        return true;
      }else{
        this.redirectUrl = state.url;
        this.router.navigate(['/login']);
        return false;
      }
  }

}
