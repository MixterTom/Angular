# 🧠 Hướng Dẫn Thiết Kế JSON Schema Cho Nền Tảng Low-Code

Trong hệ thống Low-Code, **JSON Schema chính là ngôn ngữ giao tiếp**. 
- Trình Editor (kéo thả) sinh ra JSON.
- Trình Renderer (vẽ giao diện) đọc JSON.
- Cơ sở dữ liệu (Database) lưu trữ JSON.

Vì vậy, thiết kế cấu trúc JSON chuẩn ngay từ đầu là bước **quan trọng nhất** của Lead Developer. Nếu thiết kế sai, sau này khi thêm tính năng mới, bạn sẽ phải đập đi xây lại toàn bộ.

---

## 1. Cấu Trúc Cơ Bản Của Một Node (Khối)
Dù là một cái Nút (Button), một Ô nhập chữ (Input), hay một Cái hộp (Container), tất cả đều chia sẻ chung một cấu trúc chuẩn (gọi là `ComponentNode`).

Một `ComponentNode` hoàn hảo nên có 5 phần chính:

```json
{
  "id": "btn_x8f9a2",           // Mã định danh duy nhất (Bắt buộc)
  "type": "Button",             // Loại Component để Renderer biết đường gọi Class tương ứng
  
  "properties": {               // CÁC THUỘC TÍNH (Nội dung)
    "label": "Click me",
    "disabled": false,
    "icon": "home"
  },
  
  "styles": {                   // GIAO DIỆN (Màu sắc, kích thước)
    "backgroundColor": "#0f968c",
    "padding": "10px 20px",
    "hidden": false
  },
  
  "events": {                   // SỰ KIỆN (Logic Workflow)
    "onClick": [
      {
        "action": "API_CALL",
        "endpoint": "/api/users"
      },
      {
        "action": "NAVIGATE",
        "url": "/home"
      }
    ]
  },
  
  "children": []                // CHỨA CÁC KHỐI CON (Dành cho Container, Form)
}
```

---

## 2. Phân Tích Ý Nghĩa Từng Phần

### 🌟 `id` và `type`
- `id`: Dùng để tìm kiếm và cập nhật Component trong cây JSON (khi người dùng bấm vào Property Panel bên phải để sửa). Thường dùng thư viện sinh mã ngẫu nhiên (như `uuid` hoặc `nanoid`).
- `type`: Từ khóa sống còn để Angular biết phải load Component nào (Dùng chung với `COMPONENT_REGISTRY` ở bài trước).

### 🎨 `properties` vs `styles`
Tại sao phải tách 2 cái này ra?
- `properties`: Là những **dữ liệu lõi** cấu thành nên Component. Ví dụ: Button thì phải có chữ (label), Image thì phải có nguồn ảnh (src). 
- `styles`: Là phần **trang trí**. Người dùng có thể xóa sạch style, Component vẫn hoạt động bình thường, chỉ là nó xấu thôi. Tách ra giúp Property Panel dễ render (Tab Nội dung riêng, Tab Giao diện riêng).

### ⚡ `events` (Cực kỳ quan trọng cho hệ thống phức tạp)
Không giống web thường (code `(click)="doSomething()"`). Trong Low-code, khi người dùng click, hệ thống đọc mảng `events.onClick` và chạy lần lượt các Action do người dùng cấu hình (như: Mở popup, gọi API, chuyển trang).

### 📦 `children` (Tính đệ quy)
Nếu bạn kéo một thẻ `<div class="container">`, bên trong kéo thêm 2 cái `Button`. Thì 2 cái Button đó sẽ nằm trong mảng `children` của Container. Đây là **cấu trúc Cây (Tree)**.

---

## 3. Cách Móc Nối (Mapping) JSON Vào Code Angular

Hãy nhớ lại file `button.component.ts` ban nãy. Dữ liệu từ JSON sẽ được truyền vào Angular Component như thế này:

```typescript
// Dữ liệu JSON (Giả lập việc lấy từ Store/State)
const nodeJson = {
  type: "Button",
  properties: { label: "Lưu dữ liệu", disabled: false },
  styles: { customClass: "bg-red-500 text-white" }
};

// Trong DynamicRenderer, Angular sẽ tự động thực hiện việc này ngầm:
const buttonRef = this.vcr.createComponent(ButtonComponent);
buttonRef.setInput('label', nodeJson.properties.label);
buttonRef.setInput('disabled', nodeJson.properties.disabled);
buttonRef.setInput('customClass', nodeJson.styles.customClass);
```

---

## 4. Hướng Dẫn Thực Hành Dành Cho Bạn (Bài tập tự làm)

Để nắm vững tư duy này, bạn hãy tự tay thiết kế JSON Schema và Component mẫu cho 2 thành phần sau:

### Bài tập 1: Khối Nhập Chữ (TextInput Component)
Hãy tạo một file Markdown mới hoặc nháp ra giấy:
1. JSON Schema cho `TextInput` sẽ có những properties gì? (Gợi ý: `placeholder`, `value`, `required`, `type="password" hay "text"`).
2. Tạo file `src/app/shared/ui/text-input/text-input.component.ts` (Sử dụng Signal `input()` giống như `ButtonComponent`).

### Bài tập 2: Khối Chứa (Container/Row Component)
Khối này không có nội dung gì ngoài việc chứa các khối khác, và nó có Layout (Flexbox, Grid).
1. JSON Schema cho nó có cần `properties` không? (Chắc là không, chủ yếu là `styles` như `flexDirection: row | column`).
2. Trong Component Angular của Container, làm sao để nó lặp qua mảng `children` và tiếp tục gọi `app-dynamic-renderer` để vẽ các con bên trong? (Gợi ý: Đệ quy).

> **Mẹo:** Bạn hãy tạo một file `src/app/core/models/schema.model.ts` để gõ sẵn các TypeScript Interface `ComponentNode`, `NodeProperties`, `NodeStyles` để ép kiểu cho toàn bộ hệ thống nhé! Điều này sẽ giúp bạn code nhanh hơn 10 lần nhờ tính năng gợi ý của VS Code.
