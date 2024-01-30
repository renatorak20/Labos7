import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/Post.model';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-post',
  template: `<p>Post works!</p>`,
  styleUrl: './Post.component.css',
  templateUrl: './Post.component.html'
})
export class PostComponent implements OnInit {
  @Input('post') post!: Post;
  @Input('username') username!: string;
  @Input('canEdit') canEdit: Boolean = false;
  @Output() delete = new EventEmitter<Post>();
  @Output() edit = new EventEmitter<Post>();
  constructor(private datePipe: DatePipe) {}

  isEditing = false;
  currentTextareaText: string = "";

  ngOnInit() {
    this.currentTextareaText = this.post.comment;
  }

  onEdit() {
    if (this.isEditing && this.currentTextareaText.length > 0) {
      this.isEditing = false;
      let newPost = new Post(this.currentTextareaText, this.post.timestamp, "", this.post._id);
      this.edit.emit(newPost);
    } else {
      this.isEditing = true;
    }
  }

  onDelete() {
    this.delete.emit(this.post);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSSZ') || '';
  }  
}
