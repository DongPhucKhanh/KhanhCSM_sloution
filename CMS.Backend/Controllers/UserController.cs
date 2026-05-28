// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Điều phối nghiệp vụ CRUD quản trị tài khoản không sử dụng mã hóa băm
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Bảo mật Buổi 5: Chỉ duy nhất tài khoản Admin mới được vào trang này
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. XEM DANH SÁCH THÀNH VIÊN (Index)
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // 2. FORM THÊM THÀNH VIÊN MỚI (GET)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. XỬ LÝ LƯU THÀNH VIÊN MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Kiểm tra trùng lặp Tên đăng nhập trong hệ thống
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã được sử dụng!");
                return View(model);
            }

            _context.Users.Add(model);
            _context.SaveChanges(); // Lưu dữ liệu thô trực tiếp xuống SQL Server
            return RedirectToAction(nameof(Index));
        }

        // 3. FORM CHỈNH SỬA THÀNH VIÊN (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // 3. XỬ LÝ CẬP NHẬT THÀNH VIÊN (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string NewPassword)
        {
            if (id != model.Id) return NotFound();

            // Loại bỏ kiểm tra tự động trường Password mặc định vì chúng ta xử lý qua ô NewPassword
            ModelState.Remove("Password");

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
            if (existingUser == null) return NotFound();

            // Xử lý mật khẩu thông minh: Nếu điền mật khẩu mới thì đổi, để trống thì giữ lại pass thô cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.Password = NewPassword;
            }
            else
            {
                model.Password = existingUser.Password;
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 4. THAO TÁC XÓA TÀI KHOẢN
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