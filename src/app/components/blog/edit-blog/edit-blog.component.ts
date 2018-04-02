import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { BlogService } from "../../../services/blog.service";

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  message;
  messageClass;
  currentUrl;
  loading = true;
  blog;
  processing = false;
  constructor(
      private location: Location,
      private activatedRoute: ActivatedRoute,
      private blogService: BlogService,
      private router: Router
  ) { }

    updateBlogSubmit(){
      //Submit Update!
        this.processing = true;
        this.blogService.editBlog(this.blog)
            .then(data => {
              if(!data.success){
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
                this.processing = false;
              }else{
                this.messageClass = 'alert alert-success';
                this.message = data.message;
                setTimeout(() => {
                  this.router.navigate(['/blog']);
                }, 2000);
              }
            })

    }

    goBack(){
      this.location.back();
    }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlogs(this.currentUrl.id)
        .then(data => {
          if(!data.success){
              this.messageClass = 'alert alert-danger';
              this.message = data.message;
          }else{
            this.blog = data.blog;
            this.loading = false;
          }
        })
        .catch(err => err);
  }

}
