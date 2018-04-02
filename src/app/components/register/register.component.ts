import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
    providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        public router: Router
    ) {
        this.createForm();
    }
  createForm(){
    this.form = this.formBuilder.group({
        email: ['', Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40),
            this.validateEmail
        ])],
        username: ['', Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
            this.validateUsername
        ])],
        password: ['', Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30)
        ])],
        confirm: ['', Validators.required]
    },{validator: this.matchingPasswords('password','confirm')})
  }

    matchingPasswords(password,confirm){
        return (group: FormGroup) => {
            if(group.controls[password].value === group.controls[confirm].value){
                return null;
            }else {
                return { 'matchingPasswords': true }
            }
        }
    }

  validateEmail(controls){
      var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,5}))$/);
      console.log(re.test(controls.value));
      if(re.test(controls.value)) {
            return null;
      }else {
          return {'validateEmail': true};
      }
  }

  validateUsername(controls){
      const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
      if(regExp.test(controls.value)){
          return null;
      }else {
          return {'validateUsername': true};
      }
  }

    disableForm(){
        this.form.controls['email'].disable();
        this.form.controls['username'].disable();
        this.form.controls['password'].disable();
        this.form.controls['confirm'].disable();
    }
    enableForm(){
        this.form.controls['email'].enable();
        this.form.controls['username'].enable();
        this.form.controls['password'].enable();
        this.form.controls['confirm'].enable();
    }

  onRegisterSubmit(){
      this.processing = true;
      this.disableForm();
      const user = {
          email: this.form.get('email').value,
          username: this.form.get('username').value,
          password: this.form.get('password').value
      };

      this.authService.registerUser(user)
          .then(data => {
              if(!data.success){
                  this.messageClass = 'alert alert-danger';
                  this.message = data.message;
                  this.processing = false;
                  this.enableForm();
              }else {
                  this.messageClass = 'alert alert-success';
                  this.message = data.message;
                  setTimeout(()=>{
                      this.router.navigate(['/login']);
                  },2000);
              }
          })
          .catch(err => {
              console.log(err);
          })
  }

  checkUsername (){
        const Username = this.form.get('username').value;


        this.authService.checkUsername(Username)
            .then(data => {
                if(!data.success){
                    this.usernameValid = false;
                    this.usernameMessage = data.message;
                }else {
                    this.usernameValid = true;
                    this.usernameMessage = data.message;
                }
            })
            .catch(err => err);
  }
    checkEmail (){
        const Email = this.form.get('email').value;


        this.authService.checkEmail(Email)
            .then(data => {
                if(!data.success){
                    this.emailValid = false;
                    this.emailMessage = data.message;
                }else {
                    this.emailValid = true;
                    this.emailMessage = data.message;
                }
            })
            .catch(err => err);
    }


  ngOnInit() {
  }

}
