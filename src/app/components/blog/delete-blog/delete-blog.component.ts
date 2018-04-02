import { Component, OnInit } from '@angular/core';
import { BlogService } from "../../../services/blog.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
  message;
  messageClass;
  foundBlog = false;
  processing = false;
  blog;
  currentUrl;
  constructor(
      private blogService: BlogService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private location: Location
  ) { }

  deleteBlog(){
      this.processing = true;
      this.blogService.deleteBlog(this.currentUrl.id)
          .then(data => {
            if(!data.success){
              this.messageClass = 'alert alert-danger';
              this.message = data.message;
            }else{
                this.messageClass = 'alert alert-success';
                this.message = data.message;
                setTimeout(()=> {
                  this.router.navigate(['/blog']);
                },2000);
            }
          })
  }
    goBack() {
        this.location.back();
    }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlogs(this.currentUrl.id)
        .then(data => {
          if(!data.success){
              this.messageClass = 'alert alert-danger';
              this.message = data.message;
          }else {
              this.blog = {
                  title: data.blog.title,
                  body: data.blog.body,
                  createdBy: data.blog.createdBy,
                  createdAt: data.blog.createdAt
              };
              this.foundBlog = true;
          }
        })
  }

}
