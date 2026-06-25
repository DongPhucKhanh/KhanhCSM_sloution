### 🚀 Buổi 1: Khởi tạo kiến trúc Backend & Cơ sở dữ liệu (Database Schema)
* **Nhiệm vụ:** Thiết kế cấu trúc nền tảng và Database.
* **Chi tiết công việc:**
  * Khởi tạo Solution ASP.NET Core theo mô hình phân tầng (CMS.Data, CMS.Backend).
  * Khai báo 8 thực thể lõi bằng C#: `Category`, `Product`, `Post`, `User`, `Customer`, `Order`, `OrderDetail`, `CategoryProduct`.
  * Cấu hình chuỗi kết nối (`ConnectionString`) trong `appsettings.json`.
  * Thiết lập `ApplicationDbContext` và chạy lệnh Migration (Code-First) để tự động sinh cơ sở dữ liệu trên SQL Server.
  * Cấu hình file `.gitignore` chuẩn để loại bỏ các thư mục rác (`bin/`, `obj/`) trước khi push code lên GitHub.
