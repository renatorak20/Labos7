import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PostService } from '../../services/Post.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs';
import { Post } from '../../models/Post.model';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-profile',
  templateUrl: './Profile.component.html',
  template: `<p>Profile works!</p>`,
  styleUrl: './Profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit { 

  constructor(private postsService: PostService, private authService: AuthService, private router: Router) {}

  posts: Array<Post> = [];
  postSubject: BehaviorSubject<Post[]> | null = null;
  subscription: Subscription | null = null;
  userData!: User | null;

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.userData = this.authService.getUser();
      this.postSubject = this.postsService.getPosts()!!;
      console.log(this.userData);
      this.subscription=this.postSubject!!
      .subscribe(res => {
        this.posts=res.filter((post) => post.userId == this.userData?._id );
      });
    } else {
      this.router.navigate(['/auth']);
    }
  }

}
