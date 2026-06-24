// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: DTO nhận dữ liệu thanh toán từ giao diện Khách hàng (ReactJS)
using System.Collections.Generic;

namespace CMS.Data.DTOs // Hoặc namespace bạn đang dùng cho DTO
{
    public class CheckoutRequestDto
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; } // Lời nhắn của khách cho đơn hàng
        public List<CheckoutItemDto> Items { get; set; }
    }

    public class CheckoutItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } // Giá chốt tại thời điểm mua
    }
}