import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from "../services/auth.service";
//import { FlashMessagesService } from "angular2-flash-messages";

@Injectable()
export class NotAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
       // private flashMessagesService: FlashMessagesService
    ){}

    canActivate(){
        if(this.authService.loggedIn()){
            this.router.navigate(['/']);
            //this.flashMessagesService.show('Yor are already Logined!',{cssClass: 'alert-info'});
            return false;
        }else{
            return true;
        }
    }

}
