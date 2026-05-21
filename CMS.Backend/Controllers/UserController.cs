// Họ và tên: Đồng Phúc Khánh 
// MSSV: 2123110051
// Chức năng: Quản lý người dùng + Mã hóa mật khẩu bảo mật
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity; // Thư viện bắt buộc để dùng PasswordHasher
using Microsoft.EntityFrameworkCore; // Thư viện để dùng AsNoTracking
using CMS.Data.Entities;
using CMS.Data;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH NGƯỜI DÙNG
        public IActionResult Index()
        {
            var data = _context.Users.ToList();
            return View(data);
        }

        // 2. THÊM NGƯỜI DÙNG (GET)
        public IActionResult Create()
        {
            return View();
        }

        // 2. THÊM NGƯỜI DÙNG (POST - Xử lý băm mật khẩu)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User user)
        {
            if (ModelState.IsValid)
            {
                // TIẾN HÀNH MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU
                var hasher = new PasswordHasher<User>();
                user.Password = hasher.HashPassword(user, user.Password);

                user.CreatedDate = DateTime.Now;
                _context.Users.Add(user);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // 3. SỬA THÔNG TIN (GET)
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            // Xóa trống mật khẩu hiển thị trên Form để bảo mật (không hiện chuỗi mã hóa ra)
            user.Password = string.Empty;
            return View(user);
        }

        // 3. SỬA THÔNG TIN (POST - Xử lý kiểm tra mật khẩu mới)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User user)
        {
            if (id != user.Id) return NotFound();

            // Tìm lại dữ liệu gốc trong DB để lấy lại mật khẩu cũ nếu người dùng không đổi mật khẩu
            var oldUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
            if (oldUser == null) return NotFound();

            if (string.IsNullOrEmpty(user.Password))
            {
                // Nếu để trống ô mật khẩu -> Giữ nguyên mật khẩu đã mã hóa trước đó trong DB
                user.Password = oldUser.Password;
            }
            else
            {
                // Nếu nhập mật khẩu mới -> Tiến hành mã hóa mật khẩu mới này
                var hasher = new PasswordHasher<User>();
                user.Password = hasher.HashPassword(user, user.Password);
            }

            // Xóa kiểm tra ModelState của trường Password để tránh bị bắt lỗi ép nhập dữ liệu chữ thô
            ModelState.Remove("Password");

            if (ModelState.IsValid)
            {
                _context.Users.Update(user);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // 4. XÓA NGƯỜI DÙNG
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