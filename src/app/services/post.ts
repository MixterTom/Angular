import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post as PostModel } from '../core/models/post.model'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getPosts(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(this.apiUrl);
  }
}
