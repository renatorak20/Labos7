import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Post } from '../../models/Post.model';
import { PostService } from '../../services/Post.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../models/User.model';
import { Router } from '@angular/router';
import { DataService } from '../../services/Data.service';

@Component({
  selector: 'app-posts',
  template: `<p>Posts works!</p>`,
  styleUrl: './Posts.component.css',
  templateUrl: './Posts.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PostsComponent {

  constructor(private postsService: PostService, private dataService: DataService, private authService: AuthService, private router: Router) {}

  posts: Array<Post> = [];
  postSubject: BehaviorSubject<Post[]> | null = null;
  subscription: Subscription | null = null;
  isNewPostDialogOpen = false;
  userData: User | null = null;
  users: User[] = [];

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.userData = this.authService.getUser();
      this.postSubject = this.postsService.getPosts()!!;
      this.subscription=this.postSubject!!
      .subscribe(res => {
        this.posts=res;
      });
      this.dataService.getUsers()
      .subscribe((res: any) => {
        this.users = res;
      })
    } else {
      this.router.navigate(['/auth']);
    }
  }

  getUsernameForPost(index: number): string | undefined {
    const post = this.posts[index];
    if (!post) {
      console.log("if");
      return undefined;
    }
    const user = this.users.find(u => u._id === post.userId);
    console.log(this.users);
    console.log(post.userId);
    return user ? user.username : undefined;
  }

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe();
  }

  addPost(newPost: Post) {
    if(this.authService.isAuthenticated()) {
      const postToAdd = new Post(newPost.comment, newPost.timestamp, this.authService.getUser()?._id);
      this.postsService.addPost(postToAdd);
    }
  }

  onPostDelete(postToDelete: Post) {
    if (postToDelete._id && this.authService.isAuthenticated()) {
      this.postsService.deletePost(postToDelete);
    }
  }
  
  onPostEdit(postToEdit: Post) {
    if(this.authService.isAuthenticated()) {
      const editPost = new Post(postToEdit.comment, postToEdit.timestamp, this.userData?._id, postToEdit._id);
      this.postsService.editPost(editPost);
    }
  }

  logout() {
    this.authService.logout();
  }

}
