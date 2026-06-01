// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Thêm - Sửa - Xóa Sản phẩm (CRUD) liên kết trực tiếp CategoriesProducts + Bảo mật Buổi 6
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
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bảo mật Buổi 5: Yêu cầu đăng nhập mới được sử dụng
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // 1. DANH SÁCH SẢN PHẨM + TÍCH HỢP TÌM KIẾM & LỌC DANH MỤC (Hàm Index Duy Nhất)
        public IActionResult Index(string searchString, int? categoryProductId)
        {
            // Tạo truy vấn gốc dạng IQueryable để tối ưu câu lệnh SQL khi cộng dồn điều kiện lọc
            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            // 1. Nếu Admin có nhập từ khóa tìm kiếm theo tên
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(p => p.Name.Contains(searchString));
            }

            // 2. Nếu Admin có chọn lọc theo danh mục sản phẩm cụ thể
            if (categoryProductId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            // Nạp danh sách danh mục để đổ vào ô Select trên thanh tìm kiếm của giao diện
            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();

            // Giữ lại dữ liệu đã lọc đẩy ra ViewBag để hiển thị lại trên các ô nhập liệu sau khi tải lại trang
            ViewBag.CurrentSearch = searchString;
            ViewBag.CurrentCategory = categoryProductId;

            // Thực thi câu lệnh và trả về danh sách sản phẩm sau khi lọc
            var filteredProducts = query.ToList();
            return View(filteredProducts);
        }

        // 2. THÊM MỚI SẢN PHẨM (GET)
        [HttpGet]
        public IActionResult Create()
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name");
            return View();
        }

        // 2. THÊM MỚI SẢN PHẨM (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile? imageFile)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            // Gỡ bỏ kiểm tra tự động các trường nullable và thực thể quan hệ ảo
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("imageFile");

            if (ModelState.IsValid)
            {
                if (imageFile != null && imageFile.Length > 0)
                {
                    product.ImageUrl = await SaveImage(imageFile);
                }
                else
                {
                    product.ImageUrl = "/images/products/default-product.jpg"; // Ảnh mặc định nếu trống
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync(); // Lưu dữ liệu thật xuống SQL Server
                return RedirectToAction(nameof(Index));
            }

            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // 3. CHỈNH SỬA SẢN PHẨM (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

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
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");
            if (id != product.Id) return NotFound();

            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("imageFile");

            if (ModelState.IsValid)
            {
                try
                {
                    // Lấy thực thể gốc ra so sánh link ảnh cũ (Dùng AsNoTracking tránh nghẽn luồng tracking EF)
                    var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == id);
                    if (existingProduct == null) return NotFound();

                    if (imageFile != null && imageFile.Length > 0)
                    {
                        product.ImageUrl = await SaveImage(imageFile); // Cập nhật ảnh mới chọn từ máy
                    }
                    else
                    {
                        product.ImageUrl = existingProduct.ImageUrl; // Giữ lại ảnh cũ nếu để trống ô chọn file
                    }

                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Products.Any(e => e.Id == product.Id)) return NotFound();
                    else throw;
                }
            }

            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // 4. THAO TÁC XÓA SẢN PHẨM
        public IActionResult Delete(int id)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

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