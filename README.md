🚀 Buổi 6: Triển khai Context API quản lý Giỏ hàng (Cart)
* **Nhiệm vụ:** Xử lý nghiệp vụ E-Commerce cốt lõi.
* **Chi tiết công việc:**
  * Khởi tạo `CartContext` làm Global State quản lý mảng giỏ hàng.
  * Xây dựng logic Thêm vào giỏ (kiểm tra trùng lặp), Xóa, Tăng/Giảm số lượng.
  * Tự động tính toán tổng số lượng (`cartCount`) hiển thị lên Badge đỏ ở Header và tính tổng tiền (`cartTotal`).
  * Lưu trữ mảng giỏ hàng dự phòng xuống `LocalStorage` để chống mất dữ liệu khi F5 trình duyệt.
  * 
