// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý thông tin khách hàng (Customers) - Tích hợp mã hóa mật khẩu SHA256
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH KHÁCH HÀNG (Index)
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        // 2. THÊM KHÁCH HÀNG MỚI (GET)
        public IActionResult Create()
        {
            return View();
        }

        // 2. THÊM KHÁCH HÀNG MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                // Tự động mã hóa băm mật khẩu thô trước khi lưu xuống database
                if (!string.IsNullOrEmpty(customer.Password))
                {
                    customer.Password = HashPassword(customer.Password);
                }

                _context.Customers.Add(customer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        // 3. CHỈNH SỬA KHÁCH HÀNG (GET)
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        // 3. CHỈNH SỬA KHÁCH HÀNG (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Customer customer)
        {
            if (id != customer.Id) return NotFound();

            if (ModelState.IsValid)
            {
                // Lấy thông tin khách hàng cũ từ database (AsNoTracking để tránh xung đột dữ liệu)
                var existingCustomer = _context.Customers.AsNoTracking().FirstOrDefault(c => c.Id == id);

                if (existingCustomer != null)
                {
                    // Nếu mật khẩu trên Form khác với mật khẩu cũ dưới DB -> Người dùng đã nhập mật khẩu mới -> Tiến hành băm
                    if (customer.Password != existingCustomer.Password)
                    {
                        customer.Password = HashPassword(customer.Password);
                    }
                }

                _context.Customers.Update(customer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        // 4. XÓA KHÁCH HÀNG
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        // HÀM PHỤ TRỢ: Băm mật khẩu thô sang chuỗi SHA256 dài 64 ký tự kí số chuyên nghiệp
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