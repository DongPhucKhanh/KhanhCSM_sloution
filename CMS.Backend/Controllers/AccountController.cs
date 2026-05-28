// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Xử lý logic Đăng nhập (Mật khẩu thô), Đăng xuất và Chặn quyền truy cập
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GIAO DIỆN FORM ĐĂNG NHẬP (GET)
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // 2. XỬ LÝ DỮ LIỆU ĐĂNG NHẬP ĐẨY LÊN (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Đối soát trực tiếp tên tài khoản và mật khẩu văn bản thô dưới SQL Server
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

            if (user != null)
            {
                // Tạo phiếu thông tin danh tính (Claims)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),     // Lưu vai trò để phân quyền: Admin / Editor
                    new Claim("FullName", user.FullName)       // Lưu họ tên để in ra thanh Layout
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Ghi Cookie bảo mật được mã hóa vào trình duyệt
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home"); // Vào thẳng trang chủ quản trị
            }

            // Nếu sai tài khoản/mật khẩu, trả lại thông báo lỗi chữ đỏ
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            return View();
        }

        // 3. THAO TÁC ĐĂNG XUẤT HỆ THỐNG (Logout)
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // 4. TRANG BÁO LỖI TỪ CHỐI TRUY CẬP (ACCESS DENIED - 403)
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}