import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class ChatService {
  options;
  multipartOptions;
  constructor(
      private authService: AuthService,
      private http: HttpClient
  ) {}
    getAllChatsByRoom(room){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.get(this.authService.domain + 'chat/' + room, this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    saveChat(data) {
    this.authService.createAuthHeaders();
    this.options = this.authService.options;
        //console.log(data);
        return this.http.post(this.authService.domain + 'chat/new', data ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    chatGroupSave(data){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/new_chatGroup', data ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    addChat(data){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/add_chat', data ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    getChatById(id){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/add', {id:id} ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    saveChatById(data){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/sendMessage', data ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    getAllChatGroups(username){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/getAllChatGroups', {username:username} ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    readChat(users,id){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/readChat', {users:users, id:id} ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    checkRead(id, username){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/checkRead', {id:id, username:username} ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    addUserToChat(username,id){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/addUserToChat', {id:id, username:username} ,this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    uploadImage(formData){
        this.authService.createAuthHeaders();
        this.multipartOptions = this.authService.multipartHeader;
        //this.options = this.authService.options;
        return this.http.post(this.authService.domain + 'chat/uploadImage', formData, this.multipartOptions )
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
}
