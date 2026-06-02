import { Component, OnInit, inject } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private postService = inject(PostService);

  postsList: Post[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.postsList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi API: ', err);
        this.isLoading = false;
      }
    });
  }
}
