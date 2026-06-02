# Quy trình gọi API (A-Z) trong Angular

Tài liệu này hướng dẫn chi tiết 5 bước chuẩn (Best Practice) để tích hợp và gọi một API trong Angular, sử dụng ví dụ từ `https://jsonplaceholder.typicode.com/posts`. Tại mỗi bước đều có giải thích **lý do vì sao** phải làm như vậy để bạn hiểu rõ bản chất.

---

## Bước 1: Cấu hình `HttpClient`
Để ứng dụng có quyền gửi Request ra ngoài mạng, bạn cần cung cấp `HttpClient` trong file cấu hình gốc.

**Lý do vì sao phải làm?**  
Mặc định Angular được tối ưu hoá để rất nhẹ và bảo mật, nên nó "đóng cửa" với các kết nối mạng bên ngoài. Việc thêm `provideHttpClient()` giống như cấp "visa" và cung cấp sẵn một công cụ chuẩn giúp ứng dụng của bạn được phép thực hiện các thao tác HTTP (GET, POST, PUT, DELETE).

**File:** `src/app/app.config.ts`
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 1. Import module

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // 2. Thêm vào mảng providers
  ]
};
```

---

## Bước 2: Tạo Interface / Model
Định nghĩa cấu trúc dữ liệu mà API sẽ trả về.

**Lý do vì sao phải làm?**  
Khi API trả về dữ liệu (dạng JSON), Javascript thông thường không biết bên trong đó có những trường (field) gì. Việc tạo Interface giúp TypeScript "hiểu" được hình dáng của dữ liệu (ví dụ: biết chắc chắn có `id`, `title`). Nhờ đó, trình soạn thảo (VS Code) sẽ **tự động gợi ý code (autocomplete)** và **báo lỗi ngay lập tức** nếu bạn gõ sai tên biến.

**File:** `src/app/core/models/post.model.ts`
```typescript
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
```

---

## Bước 3: Tạo Service
Service là nơi chịu trách nhiệm duy nhất cho việc tương tác với API.

**Lý do vì sao phải làm?**  
Dựa trên nguyên tắc "Đơn trách nhiệm" (Single Responsibility). Các file Component (`.ts`, `.html`) chỉ nên tập trung vào việc **hiển thị giao diện**. Các logic phức tạp hoặc gọi mạng nên được tách riêng ra Service. 
Điều này mang lại tính **tái sử dụng cao**: Nếu có 3 trang khác nhau đều cần lấy "Danh sách bài viết", bạn chỉ cần gọi lại Service này.

Tạo Service bằng lệnh:
```bash
ng generate service services/post
```

---

## Bước 4: Viết hàm gọi API trong Service
Mở file Service vừa tạo để nhúng `HttpClient` và viết logic.

**Lý do vì sao phải làm thế này?**  
Hàm `http.get()` trả về một `Observable`. Bạn có thể hiểu `Observable` giống như một **"đường ống chờ"**. Việc này giúp ứng dụng của bạn không bị "đơ" (treo giao diện) trong lúc chờ Server bên kia phản hồi dữ liệu.

**File:** `src/app/services/post.ts`
```typescript
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
```

---

## Bước 5: Gọi Service và Hiển thị ra HTML (Trong Component)
Thay vì nhồi nhét code vào file gốc `app.component`, chuẩn Angular (Best Practice) là gọi API ở bên trong các Component cụ thể (ví dụ: `DashboardComponent`). 

### 1. Xử lý logic tại TypeScript

**Lý do vì sao phải làm?**  
- Khai báo biến `isLoading` để tạo trải nghiệm người dùng (UX) tốt hơn, thông báo cho người dùng biết hệ thống đang tải.
- Sử dụng hàm `.subscribe()` để "đăng ký nhận hàng" từ Observable. Khi dữ liệu API về đến nơi, ta gán nó vào biến `postsList`.

**File:** `src/app/features/dashboard/dashboard.component.ts`
```typescript
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
```

### 2. Hiển thị ra Giao Diện

**Lý do vì sao phải làm?**  
- Dùng cú pháp `@if` và `@for` (Control Flow mới của Angular 17) giúp vòng lặp dữ liệu sạch sẽ, rõ ràng hơn.

**File:** `src/app/features/dashboard/dashboard.component.html`
```html
<div class="glass-panel">
  @if (isLoading) {
    <p>Đang kết nối Server...</p>
  } 
  @else {
    <div class="grid grid-cols-2 gap-4">
      @for (post of postsList; track post.id) {
        <div class="p-4 bg-slate-800 rounded-xl">
          <h3>{{ post.title }}</h3>
          <p>{{ post.body }}</p>
        </div>
      }
    </div>
  }
</div>
```

---
**Tóm tắt luồng dữ liệu:**  
`Component (Dashboard)` -> Gọi `Service` -> `Service` dùng `HttpClient` -> Lấy dữ liệu gán cho `Interface` -> Trả về `Component` -> Hiển thị ra `HTML`.

---

## 🛠 Lịch Sử Cập Nhật & Fix Lỗi (Changelog)

### 1. Tích hợp Neumorphism Design System
- **Quy chuẩn:** Áp dụng toàn bộ hệ thống màu sắc (Primary: `#006666`, Surface: `#E7E5E4`) và font chữ (`Space Mono`, `JetBrains Mono`) từ file `DESIGN.md` và quy tắc `SKILL (1).md`.
- **CSS Architecture:** Chuyển bộ style vào `src/styles.scss` (Global CSS) thay vì viết trong `app.scss` để tránh tình trạng Component con (như `main-layout`, `dashboard`) không nhận được CSS do cơ chế **View Encapsulation** của Angular.
- **Thành phần giao diện:** Xây dựng hệ thống class `.neu-flat` (đổ bóng lồi) và `.neu-pressed` (đổ bóng lõm) kết hợp Tailwind CSS để tạo ra UI đồng bộ 100% cho Sidebar, Header và Dashboard Card.

### 2. Khắc phục sự cố: Trình biên dịch Tailwind bị hỏng (Giant SVG Bug)
- **Triệu chứng:** Icon SVG bị phóng to khổng lồ, giao diện mất toàn bộ class CSS (mất flex, màu nền, grid, padding...). Layout bị vỡ vụn trông như một trang HTML trắng chưa từng được gắn CSS.
- **Nguyên nhân gốc rễ:** Phát hiện thông qua Terminal Log: `Tailwind CSS configuration file found but the 'tailwindcss' package is not installed`. 
  - Dự án có file cấu hình `tailwind.config.js` nhưng lại **chưa cài đặt bộ thư viện `tailwindcss`** trong `package.json`.
  - Hệ quả là trình biên dịch Angular tự động bỏ qua toàn bộ class của Tailwind (như `w-6`, `h-6`), khiến giao diện không thể load được.
- **Cách Fix:** 
  - Chạy lệnh `npm install -D tailwindcss@^3.4.0 postcss autoprefixer` (Sử dụng bản v3 vì bản v4 mới nhất đã tách thư viện PostCSS ra ngoài gây lỗi tương thích với Angular CLI hiện tại).
  - Sắp xếp lại file `styles.scss` (đẩy `@import` lên đầu) để đúng chuẩn cú pháp.

### 3. Kiến Trúc Low-Code & Lỗi Circular Dependency (Phụ thuộc vòng tròn)
- **Kiến trúc Engine:** Đã xây dựng thành công bộ máy Low-Code sử dụng `*ngComponentOutlet` (trong `NodeRendererComponent`) để tự động chuyển đổi file JSON thành giao diện UI động (Dynamic Rendering).
- **Sự cố (Màn hình trắng):** Trong quá trình xây dựng tính năng đệ quy cho `ContainerComponent`, màn hình preview bị trắng hoàn toàn và không có thông báo lỗi trên giao diện.
- **Nguyên nhân gốc rễ (Circular Dependency):**
  - `Container` import `NodeRenderer` (để vẽ thẻ con).
  - `NodeRenderer` import `COMPONENT_REGISTRY` (để lấy class tương ứng).
  - `COMPONENT_REGISTRY` lại import `Container` (để đăng ký vào từ điển).
  - **Hậu quả:** TypeScript khởi tạo theo vòng tròn, dẫn đến class `Container` bị mang giá trị `undefined` lúc app mới chạy. Từ đó hàm Outlet bị lỗi và dừng vẽ toàn bộ giao diện.
- **Cách Fix (Hàm Getter):** Chuyển biến hằng số `const COMPONENT_REGISTRY` thành một hàm `export function getComponentRegistry()`. Điều này khiến "từ điển Component" chỉ được gọi và đánh giá *sau khi* toàn bộ các class đã được Angular nạp xong vào bộ nhớ (ngay tại hàm `ngOnInit()`), phá vỡ thành công nút thắt vòng tròn!

### 4. Động Cơ Thực Thi Javascript Động (Dynamic JS Execution)
- **Cơ chế hoạt động:** Các Dumb Component (như `UiButtonComponent`) không tự xử lý logic, mà phát ra một hàm callback `onEvent()`.
- Engine (`NodeRendererComponent`) nhận sự kiện này, đọc JSON Schema (ví dụ: `events: { onClick: [{ type: "EXECUTE_JS", code: "..." }] }`) và sử dụng hàm lõi của ngôn ngữ Javascript là `new Function('node', 'payload', 'state', action.code)` để biên dịch chuỗi Text thành mã máy và thực thi trực tiếp trên trình duyệt.

### 5. Ràng Buộc Dữ Liệu & Nội Suy (Data Binding & Interpolation)
- **Tạo Global Context (RAM):** `BuilderStateService` được bổ sung một biến State mang tên `globalContext` để lưu trữ dữ liệu từ hệ thống (API, User Session...).
- **Data Interpolation Engine:** Cập nhật `NodeRendererComponent` để duyệt đệ quy (recursive traversal) toàn bộ `properties` của JSON Schema. Nếu phát hiện chuỗi chứa dấu ngoặc nhọn kép `{{ ... }}`, Engine sử dụng **Regex** để tách lấy biểu thức bên trong và dùng `new Function` để đánh giá biểu thức đó bằng các biến môi trường trong `globalContext`.
- **Thành quả:** Người dùng có thể viết cấu hình JSON dạng `"label": "Xin chào {{ user.name }}"`, và Engine tự động thay thế bằng `"Xin chào Admin Tối Cao"`. Đây là tính năng lõi (Core Feature) phân định ranh giới giữa một "No-Code Website Builder" và một "Enterprise Low-Code Platform".
