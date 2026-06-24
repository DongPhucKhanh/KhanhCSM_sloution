// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: API xử lý đặt hàng, lưu Đơn hàng (Order), Chi tiết (OrderDetail) và trừ tồn kho
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Data.DTOs;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CheckoutAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckoutRequestDto dto)
        {
            // === BƯỚC 0: KIỂM TRA TỒN KHO TRƯỚC KHI ĐẶT HÀNG ===
            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    return NotFound(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại!" });

                if (product.StockQuantity < item.Quantity)
                    return BadRequest(new
                    {
                        message = $"Sản phẩm '{product.Name}' chỉ còn {product.StockQuantity} cái trong kho, không đủ số lượng yêu cầu ({item.Quantity})!"
                    });
            }

            // === BƯỚC 1: TẠO BẢN GHI HÓA ĐƠN CHÍNH (Order) ===
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // 0: Chờ duyệt
                Notes = dto.Notes
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Sinh ra Order.Id

            // === BƯỚC 2: TẠO CHI TIẾT HÓA ĐƠN + TRỪ TỒN KHO ===
            foreach (var item in dto.Items)
            {
                // Tạo bản ghi chi tiết đơn hàng
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                };
                _context.OrderDetails.Add(orderDetail);

                // Trừ tồn kho sản phẩm (Tiêu chí 30: StockQuantity phải giảm sau khi đặt hàng)
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    _context.Products.Update(product);
                }
            }

            // Lưu tất cả xuống DB một lần
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id });
        }
    }
}