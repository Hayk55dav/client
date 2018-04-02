import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
//import { Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {

  domain = "http://localhost:8080/";
  authToken;
  user;
  options;
  multipartHeader;
  constructor(
      private http: HttpClient
  ) {this.createAuthHeaders() }

  createAuthHeaders(){
        this.loadToken();
        this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authToken }) };
        this.multipartHeader = { headers: new HttpHeaders({ 'Authorization': this.authToken }) };
  }

  loadToken(){
     this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    return this.http.post(this.domain + 'auth/register',user)
        .toPromise()
        .then(res => res)
        .catch(err => err);
  }
    checkUsername(username){
        return this.http.get(this.domain + 'auth/checkUsername/' + username)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    checkEmail(email){
        return this.http.get(this.domain + 'auth/checkEmail/' + email)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    logout(){
      this.authToken = null;
      this.user = null;
      localStorage.clear();
    }

    loggedIn(){
        return tokenNotExpired();
    }

    login(user){
      return this.http.post(this.domain + "auth/login", user)
          .toPromise()
          .then(res => res)
          .catch(err => err);
    }

    storeUserData(token, user){
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);

      this.authToken = token;
      this.user = user;
    }

    getProfile(){
      this.createAuthHeaders();
      return this.http.get(this.domain + 'auth/profile', this.options)
          .toPromise()
          .then(res => res)
          .catch(err => err);
    };

    getPublicProfile(username){
        this.createAuthHeaders();
        return this.http.get(this.domain + 'auth/publicProfile/' + username,  this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    };

    getAllUsers(){
        this.createAuthHeaders();
        return this.http.get(this.domain + 'auth/getAllUsers',  this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }


}
