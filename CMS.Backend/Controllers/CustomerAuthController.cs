// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: API Đăng ký/Đăng nhập cho Khách hàng (ReactJS gọi vào đây)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CMS.Data.Entities;
using CMS.Data;
using CMS.Backend.DTOs;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API ĐĂNG KÝ (POST: api/CustomerAuth/register)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto dto)
        {
            // Kiểm tra Email trùng
            if (await _context.Customers.AnyAsync(c => c.Email == dto.Email))
            {
                return BadRequest(new { message = "Địa chỉ Email này đã được đăng ký!" });
            }

            var newCustomer = new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = HashPassword(dto.Password), // Mã hóa SHA256 giống yêu cầu
                // Đã bỏ dòng IsActive = true đi để không bị lỗi
                Phone = dto.Phone,
                Address = dto.Address
            };

            _context.Customers.Add(newCustomer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo tài khoản khách hàng thành công!" });
        }

        // 2. API ĐĂNG NHẬP (POST: api/CustomerAuth/login)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto dto)
        {
            var hashedPass = HashPassword(dto.Password);
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email && c.Password == hashedPass);

            if (customer == null)
            {
                return BadRequest(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            // Đã bỏ khối lệnh kiểm tra if (!customer.IsActive) đi để không bị lỗi

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { customer.Id, customer.FullName, customer.Email }
            });
        }

        // Hàm băm SHA256 (Tái sử dụng từ code của bạn)
        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                var builder = new System.Text.StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}