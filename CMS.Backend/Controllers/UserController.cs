// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: CRUD quản trị tài khoản - Mã hóa mật khẩu SHA256 trước khi lưu (Tiêu chí 33)
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ Admin mới được quản lý tài khoản
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================================
        // HÀM MÃ HÓA SHA256 - Dùng chung trong Controller
        // ============================================================
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var sb = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                    sb.Append(bytes[i].ToString("x2"));
                return sb.ToString();
            }
        }

        // 1. DANH SÁCH THÀNH VIÊN
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // 2. FORM THÊM THÀNH VIÊN (GET)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. LƯU THÀNH VIÊN MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã được sử dụng!");
                return View(model);
            }

            // Mã hóa mật khẩu SHA256 trước khi lưu vào Database
            model.Password = HashPassword(model.Password);

            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 3. FORM CHỈNH SỬA (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // 3. CẬP NHẬT THÀNH VIÊN (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string NewPassword)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("Password");

            if (!ModelState.IsValid)
                return View(model);

            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
            if (existingUser == null) return NotFound();

            // Nếu nhập mật khẩu mới → băm rồi lưu. Để trống → giữ nguyên hash cũ
            if (!string.IsNullOrEmpty(NewPassword))
                model.Password = HashPassword(NewPassword);
            else
                model.Password = existingUser.Password;

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 4. XÓA TÀI KHOẢN
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}