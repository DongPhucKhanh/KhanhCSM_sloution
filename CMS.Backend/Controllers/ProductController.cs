// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Thêm - Sửa - Xóa Sản phẩm (CRUD) liên kết trực tiếp CategoriesProducts
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // 1. DANH SÁCH SẢN PHẨM (Index)
        public IActionResult Index()
        {
            var products = _context.Products
                                   .Include(p => p.CategoryProduct) // Nạp kèm thực thể danh mục để lấy Tên hiển thị
                                   .ToList();
            return View(products);
        }

        // 2. THÊM MỚI SẢN PHẨM (GET)
        public IActionResult Create()
        {
            // Bốc dữ liệu từ bảng CategoriesProducts đổ vào Dropdown
            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name");
            return View();
        }

        // 2. THÊM MỚI SẢN PHẨM (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                product.ImageUrl = await SaveImage(imageFile);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // 3. CHỈNH SỬA SẢN PHẨM (GET)
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // 3. CHỈNH SỬA SẢN PHẨM (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product, IFormFile? imageFile)
        {
            if (id != product.Id) return NotFound();

            if (imageFile != null && imageFile.Length > 0)
            {
                product.ImageUrl = await SaveImage(imageFile);
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // 4. XÓA SẢN PHẨM
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        // HÀM PHỤ TRỢ: Lưu file ảnh vào thư mục wwwroot/images/products
        private async Task<string> SaveImage(IFormFile file)
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "products");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            return "/images/products/" + uniqueFileName;
        }
    }
}