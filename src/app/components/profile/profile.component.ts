import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ChatService} from "../../services/chat.service";



@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [AuthService]
})
export class ProfileComponent implements OnInit {
    username;
    email;
    message;
    success;
    selectedFile = null;
    imgPath;
    // filesToUpload: Array<File>;
    constructor(private authService: AuthService,
                private chatService: ChatService,
    ) {


    }

    fileChangeEvent(event){
        this.selectedFile = event.target.files[0];
    }

    upload(){
        let formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        this.chatService.uploadImage(formData)
            .then(res => {
                setTimeout(() =>{
                    this.imgPath = res.imgPath.path;
                }, 4000);
            })
            .catch(err => err);
    }


    ngOnInit() {
        this.authService.getProfile()
            .then(profile => {
                console.log(profile.user);
                this.username = profile.user.username;
                this.email = profile.user.email;
            });

    }

}
