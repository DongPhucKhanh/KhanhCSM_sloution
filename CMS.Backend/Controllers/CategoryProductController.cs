// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý danh mục sản phẩm độc lập (Đã đồng bộ tên bảng CategoriesProducts)
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH DANH MỤC SẢN PHẨM (Index)
        public IActionResult Index()
        {
            // Đã sửa thành CategoriesProducts cho khớp DbContext
            var categories = _context.CategoriesProducts.ToList();
            return View(categories);
        }

        // 2. THÊM DANH MỤC MỚI (GET)
        public IActionResult Create()
        {
            return View();
        }

        // 2. THÊM DANH MỤC MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // 3. CHỈNH SỬA DANH MỤC (GET)
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // 3. CHỈNH SỬA DANH MỤC (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // 4. XÓA DANH MỤC
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}