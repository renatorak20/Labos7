import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../../models/Post.model';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-new-post-dialog',
  template: `<p>NewPostDialog works!</p>`,
  styleUrl: './NewPostDialog.component.css',
  templateUrl: './NewPostDialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPostDialogComponent implements OnInit {
  @Output() postCreated = new EventEmitter<Post>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userData = this.authService.getUser();
  }

  commentInput = "";
  userData!: User | null

  createPost() {
    if(this.authService.isAuthenticated()) {
      this.postCreated.emit(new Post(this.commentInput, new Date()));
      this.commentInput = "";
    }
  }
}
