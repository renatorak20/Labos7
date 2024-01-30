import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Post } from '../models/Post.model';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  
  getPosts() {
    return this.http.get<{ rows: Post[]}>(('posts'))
      .pipe(map(res => {
        return res.rows.map(post => {
          return { ...post } as Post;
        });
      }));
  }

  addPost(newPost: Post) {
    return this.http.post<{ post: Post}>('posts', newPost)
  }

  deletePost(postToDelete: Post) {
    return this.http.delete<{ rows: number }>(`posts/${postToDelete._id}`)
  }

  editPost(postToEdit: Post) {
    const { _id: id, ..._postToEdit } = postToEdit
    return this.http.put<{ rows: number }>('posts', _postToEdit);
  }

  getUsers() {
    return this.http.get<{ rows: User[] }>('users').pipe(
      map(response => {
        return response.rows.map(user => {
          return { ...user } as User;
        });
      })
    );
  }

  addUser(newUser: User) {
    return this.http.post('users', newUser)
  }

}
