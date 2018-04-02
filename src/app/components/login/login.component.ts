import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  previoursUrl;
  form: FormGroup;

  constructor(
      private formBuilder:FormBuilder,
      private authService: AuthService,
      private router: Router,
      private authGuard: AuthGuard
  ) {
    this.createForm();
  }


  createForm(){
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    })
  }

  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm(){
      this.form.controls['username'].enable();
      this.form.controls['password'].enable();

  }

  onLoginSubmit(){
    this.processing = true;
    this.disableForm();
      const user = {
        username: this.form.get('username').value,
        password: this.form.get('password').value
      };

      this.authService.login(user)
          .then( data => {
            if(!data.success){
                this.messageClass = "alert alert-danger";
                this.message = data.message;
                this.processing = false;
                this.enableForm();
            }else {
              this.messageClass = 'alert alert-success';
              this.message = data.message;
              console.log(data);
              this.authService.storeUserData(data.token , data.user.username);
              setTimeout(()=> {
                  if(this.previoursUrl){
                      this.router.navigate([this.previoursUrl]);
                  }else{
                      this.router.navigate(['/profile']);
                  }
              }, 2000);
            }
          })
  }

  ngOnInit() {
      if(this.authGuard.redirectUrl){
          this.messageClass = 'alert alert-danger';
          this.message = 'You must be logged in to view that page';
          this.previoursUrl = this.authGuard.redirectUrl;
          this.authGuard.redirectUrl = undefined;
      }
  }

}
