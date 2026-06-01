# 🚀 My Awesome App - Angular Enterprise Architecture

Chào mừng bạn đến với **My Awesome App**! Dự án này được thiết lập với bộ khung chuẩn dành cho dự án Angular lớn (Enterprise), sử dụng Angular Standalone Components mới nhất.

## 📁 Cấu Trúc Thư Mục (Domain-Driven Design)

Mã nguồn chính nằm trong thư mục `src/app/`. Kiến trúc được chia thành 4 phần lõi như sau:

```text
src/app/
├── core/               # 🛡️ Cốt lõi của hệ thống (Chỉ khởi tạo 1 lần - Singleton)
│   ├── guards/         # Bảo vệ Routes (vd: AuthGuard kiểm tra đăng nhập)
│   ├── interceptors/   # Bắt và xử lý HTTP Request/Response (vd: gắn Token, bắt lỗi chung)
│   ├── models/         # Định nghĩa các TypeScript Interface dùng chung toàn cục
│   └── services/       # Nơi gọi API Backend (Http Services) và xử lý logic chung
│
├── features/           # 🌟 Chứa các chức năng (Module) chính của dự án
│   ├── auth/           # Giao diện Đăng nhập / Đăng ký
│   └── dashboard/      # Giao diện trang chủ nội bộ sau đăng nhập
│   # Mỗi feature tự chứa components, logic, styles riêng của nó
│
├── layouts/            # 🖼️ Các Layout bao ngoài giao diện chính
│   ├── auth-layout/    # Khung layout trống cho màn hình Đăng nhập
│   └── main-layout/    # Khung layout có Header, Sidebar, Footer...
│
└── shared/             # ♻️ Các thành phần dùng chung ở mọi nơi (Không gọi API trực tiếp)
    ├── components/     # UI Components (Buttons, Modals, Tables, Forms)
    ├── directives/     # Custom directives để điều khiển DOM
    ├── pipes/          # Custom pipes để định dạng dữ liệu (vd: Currency, Date)
    └── utils/          # Các hàm Helpers / Constants / Regex dùng nhiều nơi
```

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt các thư viện (Lần đầu tiên)
Mở Terminal, đi vào thư mục dự án (`my-awesome-app`) và chạy:
```bash
npm install
```

### 2. Khởi chạy Server (Môi trường Development)
Sử dụng câu lệnh sau để chạy:
```bash
npm start
```
*Hoặc nếu muốn mở trình duyệt ngay khi code xong, chạy lệnh:*
```bash
npm start -- -o
```
🌐 **Truy cập dự án tại:** [http://localhost:4200/](http://localhost:4200/)

### 3. Build & Đóng gói (Dành cho Production)
Khi cần triển khai (deploy) dự án lên host:
```bash
npm run build
```
Mã nguồn đã được tối ưu hoá sẽ nằm trong thư mục `dist/`.

## ⚙️ Cấu hình chạy nhanh với VS Code (Run Configuration)
Dự án đã được cấu hình sẵn trong `.vscode`. Bạn có thể chạy nhanh dự án bằng cách:
1. Mở menu **Run and Debug** của VS Code (Phím tắt `Ctrl + Shift + D`).
2. Chọn **"Launch Chrome"** hoặc **"Launch Edge"**.
3. Bấm nút Play 🟢 (hoặc nhấn `F5`) để tự động chạy ứng dụng và bật chế độ Debug của trình duyệt.

## 📦 Quản Lý Phiên Bản Thư Viện (Dependency Management)
Trong các dự án lớn, việc đồng bộ phiên bản thư viện giữa các thành viên trong team là **cực kỳ quan trọng**. Dự án này đã được áp dụng chiến lược quản lý chặt chẽ:

1. **`.npmrc` (save-exact)**: Đã được thêm vào dự án. Mỗi khi bạn chạy `npm install <package>`, NPM sẽ tự động khoá cứng phiên bản lại (VD: `1.2.3` thay vì `^1.2.3`). Điều này tránh được lỗi "chạy được trên máy tôi nhưng lỗi trên máy bạn" khi có bản cập nhật nhỏ của thư viện.
2. **`package-lock.json`**: Hãy luôn luôn `git commit` file này để toàn bộ team tải xuống đúng một cây thư viện y hệt nhau.
