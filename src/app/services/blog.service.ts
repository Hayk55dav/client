import { Injectable } from '@angular/core';
//import {HttpHeaders} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class BlogService {
  domain = this.authService.domain;
  options;
  constructor(
      private authService: AuthService,
      private http: HttpClient
  ) { }

    newBlog(blog){
    this.authService.createAuthHeaders();
    this.options = this.authService.options;
    return this.http.post(this.domain + 'blogs/newBlog', blog , this.options)
        .toPromise()
        .then(res => res)
        .catch(err => err);
    }

    getAllBlogs(){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.get(this.domain + 'blogs/allBlogs',  this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    getSingleBlogs(id){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.get(this.domain + 'blogs/singleBlog/' + id,  this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    editBlog(blog){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.put(this.domain + 'blogs/updateBlog', blog,  this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    deleteBlog(id){
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    likeBlog(id){
        const blogData = {id: id};
        return this.http.put(this.domain  + 'blogs/likeBlog/', blogData, this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }

    dislikeBlog(id){
        const blogData = {id: id};
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.put(this.domain  + 'blogs/dislikeBlog/', blogData, this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }
    postComment(id, comment){
        const blogData = {id: id, comment: comment};
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        return this.http.post(this.domain  + 'blogs/comment', blogData, this.options)
            .toPromise()
            .then(res => res)
            .catch(err => err);
    }


}
