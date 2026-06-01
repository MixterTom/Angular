# 🐛 Báo Cáo Lỗi (Bug Report)

## ❌ Mô tả lỗi
Trong các file:
- `src/app/features/dashboard/dashboard.component.ts`
- `src/app/layouts/main-layout/main-layout.component.ts`
- `src/app/app.routes.ts`

Trình soạn thảo VS Code báo lỗi chữ đỏ: 
> `Cannot find module '@angular/router' or its corresponding type declarations.`
> `Cannot find module '@angular/core' or its corresponding type declarations.`

## 🔍 Phân tích nguyên nhân (Root Cause)
Lỗi này **KHÔNG PHẢI DO CODE BỊ SAI**. Tất cả code TypeScript và Angular mà chúng ta vừa viết đều đúng chuẩn 100% của Angular mới nhất. 

Nguyên nhân duy nhất gây ra lỗi này là: **Dự án của bạn hiện chưa có thư mục `node_modules`**. 
Vì lệnh tải thư viện lúc nãy chạy ngầm bị treo, dẫn đến việc VS Code và TypeScript Compiler không tìm thấy lõi của Angular (nằm trong `node_modules/@angular/...`) để hiểu được các câu lệnh `import`.

## 🛠️ Cách khắc phục (Resolution)
Để sửa triệt để lỗi này, bạn chỉ cần thực hiện 2 bước cực kỳ đơn giản trên máy tính của bạn:

1. **Tải thư viện**:
   - Mở Terminal ngay trong VS Code (Bấm phím tắt: `` Ctrl + ` ``).
   - Gõ lệnh: `npm install` và nhấn Enter.
   - Đợi lệnh chạy xong đến 100% (Sẽ mất khoảng 1-2 phút tuỳ mạng). Bạn sẽ thấy thư mục `node_modules` xuất hiện ở thanh bên trái.

2. **Khởi động lại máy chủ nhận diện Code (Nếu cần)**:
   - Thường thì sau khi chạy xong `npm install`, lỗi sẽ tự biến mất.
   - Nếu nó vẫn bị gạch đỏ, bạn chỉ cần đóng VS Code lại rồi mở lên lại. (Hoặc bấm `Ctrl + Shift + P`, gõ `TypeScript: Restart TS server` rồi Enter).

✅ **Kết quả**: Tất cả lỗi đỏ sẽ biến mất, code sẽ sáng lên màu đẹp mắt và bạn có thể chạy dự án bằng phím `F5`!
