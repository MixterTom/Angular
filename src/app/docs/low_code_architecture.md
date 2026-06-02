# 🚀 Cẩm Nang Kiến Trúc Dự Án Low-Code (Dành Cho Lead Dev)

Với vai trò là Dev chính (Lead/Core Developer) của một nền tảng Low-Code, bạn không chỉ code giao diện mà đang **code ra một hệ thống sinh ra giao diện**. 

Đây là bức tranh toàn cảnh và cách tư duy bạn cần trang bị để xây dựng nền tảng này bằng Angular 17+.

---

## 1. Tư duy cốt lõi của một hệ thống Low-Code
Hệ thống Low-Code thực chất là một **JSON Renderer (Trình thông dịch JSON)**. Bạn không viết trực tiếp thẻ `<button>` vào HTML nữa, mà người dùng sẽ kéo thả, tạo ra một file JSON, và hệ thống của bạn đọc file JSON đó để vẽ ra cái nút.

**Cấu trúc dữ liệu JSON mẫu:**
```json
{
  "type": "Button",
  "id": "btn_123",
  "properties": {
    "label": "Gửi dữ liệu",
    "color": "primary",
    "disabled": false
  },
  "events": {
    "onClick": "submitFormAction"
  }
}
```

---

## 2. Kiến trúc 3 Lớp (The 3-Layer Architecture)

Để dự án không bị vỡ nát khi phình to, bạn cần chia hệ thống thành 3 module chính:

### A. The Editor (Trình kéo thả - Canvas)
- **Nhiệm vụ:** Nơi người dùng kéo thả các khối (Block) vào màn hình.
- **Công nghệ:** Angular CDK Drag & Drop.
- **Đầu ra:** Khi kéo thả xong, Editor sinh ra một cục cấu hình JSON khổng lồ (gọi là `Schema`).

### B. The Property Panel (Bảng Thuộc Tính)
- **Nhiệm vụ:** Khi bấm vào 1 Component trên Canvas, panel bên phải sẽ hiện ra để đổi màu, đổi chữ.
- **Thiết kế:** Nó là các form tự động sinh ra dựa trên loại Component đang được chọn.

### C. The Renderer Engine (Động cơ Render) - Quan trọng nhất!
- **Nhiệm vụ:** Nhận mảng JSON từ Editor và dùng `*ngComponentOutlet` để vẽ ra các Component thật.

---

## 3. Thiết kế Component Tái Sử Dụng (Dumb Component)

Trong Low-Code, các Component UI (Nút, Form, Bảng) phải cực kỳ **"Dumb" (Ngu ngốc)**. 
Nghĩa là nó không được chứa logic gọi API, không tự quản lý dữ liệu. Nó chỉ nhận dữ liệu qua `@Input` và báo cáo sự kiện qua `@Output`.

**Ví dụ một Nút bấm (Button) chuẩn Low-code (Sử dụng Signal Inputs của Angular 17):**

```typescript
// shared/ui/button/button.component.ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lowcode-button',
  standalone: true,
  template: `
    <button 
      [class]="'neu-button px-4 py-2 transition-all ' + customClass()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)">
      
      @if(icon()) { <span class="mr-2">{{ icon() }}</span> }
      {{ label() }}
      
    </button>
  `
})
export class ButtonComponent {
  // 1. Nhận toàn bộ cấu hình từ JSON thông qua Input
  label = input<string>('Nút mặc định');
  icon = input<string>('');
  disabled = input<boolean>(false);
  customClass = input<string>('');

  // 2. Đẩy sự kiện ra ngoài cho Engine xử lý
  onClick = output<MouseEvent>();
}
```

---

## 4. Trái tim của Low-Code: Dynamic Rendering (Vẽ Động)

Đây là cách bạn đọc JSON và vẽ ra giao diện mà không cần hard-code thẻ HTML:

```typescript
// core/renderer/dynamic-renderer.component.ts
import { Component, Input, ViewContainerRef, ComponentRef, OnInit, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';

// Map chuỗi string từ JSON sang Class Component thật
const COMPONENT_REGISTRY: Record<string, any> = {
  'Button': ButtonComponent,
  'TextInput': InputComponent,
};

@Component({
  selector: 'app-dynamic-renderer',
  standalone: true,
  template: `<ng-container #container></ng-container>`
})
export class DynamicRendererComponent implements OnInit {
  @Input() config!: any; // Nhận 1 object JSON
  
  private vcr = inject(ViewContainerRef);

  ngOnInit() {
    // 1. Tìm Class tương ứng với type trong JSON
    const ComponentClass = COMPONENT_REGISTRY[this.config.type];
    
    if (ComponentClass) {
      // 2. Khởi tạo Component động lên màn hình
      const componentRef = this.vcr.createComponent(ComponentClass) as ComponentRef<any>;
      
      // 3. Đổ dữ liệu từ JSON (properties) vào Component
      Object.keys(this.config.properties).forEach(key => {
        componentRef.setInput(key, this.config.properties[key]);
      });
    }
  }
}
```

---

## 5. Tổ chức thư mục chuẩn (Folder Structure)

Để code không trở thành "bát phở trộn" sau 3 tháng, hãy thiết lập thư mục như sau:

```text
src/
├── app/
│   ├── core/               # Trái tim dự án
│   │   ├── engines/        # Chứa DynamicRenderer, SchemaParser
│   │   ├── state/          # Quản lý Global State (NgRx hoặc Signals)
│   ├── shared/             # Code dùng chung
│   │   ├── ui/             # Các Dumb Component (Button, Input, Card)
│   │   ├── utils/          # Hàm helper (format JSON, generate ID)
│   ├── features/           # Các chức năng lớn
│   │   ├── builder/        # Màn hình Kéo - Thả (Editor Canvas)
│   │   ├── property-panel/ # Bảng chỉnh sửa thuộc tính bên phải
│   │   ├── preview/        # Màn hình chạy thử JSON
```

## 6. Lời khuyên cho Lead Dev
1. **Đừng tự viết mọi thứ:** Hãy tận dụng thư viện. Dùng `Angular CDK DragDrop` cho việc kéo thả.
2. **Kiểm soát State:** JSON Schema của màn hình sẽ thay đổi liên tục khi kéo thả, hãy dùng **Angular Signals** (hoặc NgRx Store) để quản lý cây JSON (Tree Nodes) này.
3. **Mọi Component phải có Schema mặc định:** Bất cứ khi nào tạo một Component mới (VD: Bảng Data Grid), bạn phải định nghĩa sẵn file JSON mặc định của nó để khi kéo vào Canvas nó hiển thị được ngay.
