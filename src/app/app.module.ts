import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {RegisterComponent} from './components/register/register.component';
import {AuthService} from "./services/auth.service";
import {BlogService} from "./services/blog.service";
import {ChatService} from "./services/chat.service";
import {HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './components/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';
import {FlashMessagesModule, FlashMessagesService} from "angular2-flash-messages";
import {AuthGuard} from "./guards/auth.guard";
import {NotAuthGuard} from "./guards/not-auth.guard";
import {BlogComponent} from './components/blog/blog.component';
import {EditBlogComponent} from './components/blog/edit-blog/edit-blog.component';
import {DeleteBlogComponent} from './components/blog/delete-blog/delete-blog.component';
import {PublicProfileComponent} from './components/public-profile/public-profile.component';
import {ChatComponent} from './components/chat/chat.component';
import {SearchFilterPipe} from "./components/chat/chat.component";
import {FileUploadModule} from "ng2-file-upload";



@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        DashboardComponent,
        RegisterComponent,
        LoginComponent,
        ProfileComponent,
        BlogComponent,
        EditBlogComponent,
        DeleteBlogComponent,
        PublicProfileComponent,
        ChatComponent,
        SearchFilterPipe,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FlashMessagesModule,
        FileUploadModule
    ],
    providers: [
        AuthService,
        FlashMessagesService,
        AuthGuard,
        NotAuthGuard,
        BlogService,
        ChatService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
