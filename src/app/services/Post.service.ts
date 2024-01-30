import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Post } from '../models/Post.model';
import { DataService } from './Data.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: Post[] = [];
  postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  constructor(private dataService: DataService) {
    this.init()
  }

  init() {
    this.getNewestPosts();
  }

  getNewestPosts() {
    this.dataService.getPosts()
    .subscribe((res:any) => {
      this.posts = res;
      this.postsSubject.next([...this.posts]);
    })
  }

  getPosts() {
    return this.postsSubject;
  }


addPost(newPost: Post) {
  this.dataService.addPost(newPost)
    .subscribe((res: any) => {
      const updatedPost = new Post(
        newPost.comment,
        newPost.timestamp,
        newPost.userId,
        res._id
      );

      this.posts.push(updatedPost);
      this.postsSubject.next([...this.posts]);
    });
}

  getPost(id: string) {
    return this.posts.find(c=> c._id == id);
  }

  deletePost(postToDelete: Post) {
    this.dataService.deletePost(postToDelete)
    .subscribe((res => {
      this.posts = this.posts.filter(c=> c._id!=postToDelete._id);
      this.postsSubject.next([...this.posts]);
    }))
  }

  editPost(postToEdit: Post) {
    this.dataService.editPost(postToEdit)
    .subscribe((res => {
      this.posts[this.posts.findIndex(c => c._id == postToEdit._id)] = postToEdit;
      this.postsSubject.next([...this.posts]);
    }))
  }

}

interface FireResponse {
  name: string;
}
