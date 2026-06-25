## 🚀 Buổi 4: Khởi tạo Frontend ReactJS & Thiết lập Routing
* **Nhiệm vụ:** Chuyển sang Client-side, dựng khung xương SPA.
* **Chi tiết công việc:**
  * Khởi tạo dự án ReactJS (`cms.frontend`).
  * Tổ chức cấu trúc thư mục chuẩn doanh nghiệp: `components`, `pages`, `contexts`, `services`.
  * Cài đặt `react-router-dom`, thay thế toàn bộ thẻ `a href` bằng Hook `useNavigate` để định tuyến không tải lại trang.
  * Thiết lập Axios Client (`axiosClient.js`) và lưu trữ Base URL an toàn trong file biến môi trường `.env`.

### 🚀 Buổi 5: Xây dựng giao diện Trang chủ & Lọc giá động (Shop Page)
* **Nhiệm vụ:** Render dữ liệu động từ API lên giao diện ReactJS.
* **Chi tiết công việc:**
  * Component hóa giao diện: Tạo Header, Footer, Hero Banner.
  * Gọi API `GET /api/product` và render danh sách "Sản phẩm bán chạy" lên Trang chủ.
  * Hoàn thiện trang Cửa hàng (Shop): Thiết kế thanh điều hướng cố định (Sticky Sidebar).
  * **Kỹ thuật khó:** Ứng dụng Hook `useSearchParams` để bắt sự kiện người dùng nhập khoảng giá (Min - Max), đồng bộ thông số lên URL và gọi API lọc giá động ngầm (Realtime).
