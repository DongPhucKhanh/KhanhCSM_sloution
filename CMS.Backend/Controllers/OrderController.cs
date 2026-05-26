// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý mạch nghiệp vụ Đơn hàng (CRUD) tương thích cấu trúc thực thể Order
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH ĐƠN HÀNG (Index)
        public IActionResult Index()
        {
            var orders = _context.Orders
                                 .Include(o => o.Customer)
                                 .OrderByDescending(o => o.OrderDate)
                                 .ToList();
            return View(orders);
        }

        // 2. XEM CHI TIẾT ĐƠN HÀNG (Details)
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                                .Include(o => o.Customer)
                                .Include(o => o.OrderDetails)
                                    .ThenInclude(od => od.Product)
                                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();
            return View(order);
        }

        // 3. THÊM ĐƠN HÀNG MỚI (GET)
        public IActionResult Create()
        {
            ViewBag.CustomerId = new SelectList(_context.Customers.ToList(), "Id", "FullName");
            return View();
        }

        // 3. THÊM ĐƠN HÀNG MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Order order)
        {
            if (ModelState.IsValid)
            {
                _context.Orders.Add(order);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers.ToList(), "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // 4. CHỈNH SỬA ĐƠN HÀNG (GET)
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            ViewBag.CustomerId = new SelectList(_context.Customers.ToList(), "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // 4. CHỈNH SỬA ĐƠN HÀNG (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Order order)
        {
            if (id != order.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Orders.Update(order);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers.ToList(), "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // 5. CẬP NHẬT NHANH TRẠNG THÁI TẠI TRANG INDEX (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            order.Status = status;
            _context.Orders.Update(order);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // 6. XÓA ĐƠN HÀNG
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                // Dọn dẹp bản ghi con trong OrderDetails trước để tránh xung đột khóa ngoại SQL
                var details = _context.OrderDetails.Where(od => od.OrderId == id).ToList();
                if (details.Any())
                {
                    _context.OrderDetails.RemoveRange(details);
                }

                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}