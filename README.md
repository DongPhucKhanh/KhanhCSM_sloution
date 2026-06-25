🚀 Buổi 7: Luồng Đăng nhập Khách hàng & Thanh toán (Checkout)
* **Nhiệm vụ:** Hoàn tất luồng mua sắm của Khách hàng (Customer).
* **Chi tiết công việc:**
  * Xây dựng Form Đăng nhập / Đăng ký cho phía ReactJS, lưu trữ thông tin Customer vào LocalStorage và cập nhật trạng thái Topbar.
  * Viết trang Thanh toán (Checkout.jsx), ép Validate dữ liệu biểu mẫu (Bắt buộc nhập Tên, SĐT, Địa chỉ).
  * Gửi HTTP POST Request mang theo Payload Giỏ hàng xuống Backend để chốt đơn.
  * Xử lý gọi hàm `clearCart()` để dọn dẹp sạch giỏ hàng sau khi Server báo mã 200 OK.
