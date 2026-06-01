import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ở Angular 17+, ta ưu tiên dùng hàm inject() thay vì viết constructor
  private readonly http = inject(HttpClient);
  
  // Lấy URL từ biến môi trường (environment.ts)
  private readonly baseUrl = environment.apiUrl;

  /**
   * Lấy danh sách dữ liệu (GET)
   * @param endpoint đường dẫn phụ (vd: '/users')
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Tạo mới dữ liệu (POST)
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Cập nhật dữ liệu (PUT)
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Xoá dữ liệu (DELETE)
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
