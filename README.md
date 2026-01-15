# 📦 WDS E-commerce Backend - Shoe Store API

Hệ thống Backend cho dự án website thương mại điện tử mô phỏng Shop Giày online. Dự án được xây dựng trên nền tảng Node.js với Framework Hono, sử dụng kiến trúc phân lớp rõ ràng để đảm bảo khả năng mở rộng và bảo trì.

## 📖 Giới thiệu dự án

Hệ thống cung cấp đầy đủ các API phục vụ cho một trang thương mại điện tử:

- **Quản lý sản phẩm:** Tìm kiếm, lọc theo giá, sắp xếp và quản lý kho hàng.
- **Hệ thống giỏ hàng:** Xử lý thêm/sửa/xóa sản phẩm trong giỏ và tính toán tổng tiền.
- **Quản lý đơn hàng:** Lưu trữ lịch sử mua hàng và thông tin vận chuyển.
- **Xác thực & Phân quyền:** Đăng ký, đăng nhập bằng JWT và phân quyền giữa User/Admin.

## 🛠 Tech Stack

Hệ thống được xây dựng với các công nghệ hiện đại nhất:

- **Runtime:** [Node.js](https://nodejs.org/ "null") (ES Modules)
- **Framework:** [Hono](https://hono.dev/ "null") - Framework siêu nhẹ và hiệu năng cực cao.
- **ORM:** [Prisma](https://www.prisma.io/ "null") - Thao tác cơ sở dữ liệu an toàn và linh hoạt.
- **Database:** MariaDB (Hỗ trợ tốt cho các giao dịch quan hệ).
- **Validation:** [Zod](https://zod.dev/ "null") - Kiểm soát dữ liệu đầu vào thông qua DTOs.
- **Authentication:** JSON Web Token (JWT) & Bcrypt.

## 📁 Cấu trúc thư mục

Dự án được tổ chức theo mô hình **Repository - Service - Controller**:

```
src/
├── auth/           # Middleware xác thực và kiểm tra JWT
├── config/         # Cấu hình kết nối Prisma Client
├── controllers/    # Tiếp nhận request và trả về response
├── DTOs/           # Data Transfer Objects (Validation với Zod)
├── exceptions/     # Định nghĩa các lớp lỗi HTTP tùy chỉnh
├── middlewares/    # Các middleware trung gian (Auth, Error Handler)
├── repository/     # Tầng truy cập dữ liệu trực tiếp qua Prisma
├── routes/         # Khai báo các Endpoint API
├── services/       # Xử lý Logic nghiệp vụ chính
└── utils/          # Các hàm hỗ trợ (Mappers, Handlers)
```

## ⚙️ Cài đặt và Chạy Project

### 1. Yêu cầu hệ thống

- Node.js phiên bản 18 trở lên.
- Một instance MariaDB đang hoạt động.

### 2. Các bước cài đặt

```
# Clone repository
git clone <https://github.com/b1nhan/wds-test-grOne-BE>
cd be-wds-test

# Cài đặt dependencies
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc dựa trên file `.env.example`:

```
DATABASE_URL=""
DB_HOST=""
DB_PORT=
DB_USERNAME=""
DB_PASSWORD=""
DB_NAME=""
JWT_SECRET_KEY=""
```

### 4. Khởi tạo Database

Cần chạy các lệnh sau để đồng bộ Schema và nạp dữ liệu mẫu trước khi test:

```
# Đồng bộ schema với database
npx prisma db push

# Nạp dữ liệu mẫu (Tài khoản & Sản phẩm)
npm run seed
```

### 5. Chạy ứng dụng

```
# Chế độ phát triển
npm run dev
```

## 🧪 Lưu ý khi Test hệ thống

### Quy chuẩn API

- **Base URL:** `/api/v1`
- **Xác thực:** Sử dụng Bearer Token trong header `Authorization: Bearer <token>`.
- **Tiền tệ:** Toàn bộ đơn giá được tính bằng VNĐ (Số nguyên).
- **Ngày tháng:** Định dạng ISO 8601.
- **Database:** Cấu hình ở file .env
- **Tài khoản Admin:** Cần được tạo ở database với `role` là `admin`
- Trong quá trình sử dụng có thể gặp lỗi `pool connection timeout` giữa database và server, có thể fix tạm thời bằng cách restart Server
