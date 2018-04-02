import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl;
  username;
  email;
  messageClass;
  message;
  foundProfile = false;
  constructor(
      public authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getPublicProfile(this.currentUrl.username)
        .then(data => {
          if(!data.success){
            this.message = data.message;
            this.messageClass = 'alert alert-danger';
          }else{
              this.foundProfile = true;
              this.username = data.user.username;
              this.email = data.user.email;
              console.log(this.foundProfile);
          }
        })
        .catch(err => err);
  }

}
