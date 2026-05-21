// Họ và tên: Đồng Phúc Khánh 
// MSSV: 2123110051
// Version: 2.3 (Sửa triệt để lỗi trống danh mục)
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // 1. DANH SÁCH BÀI VIẾT
        public IActionResult Index()
        {
            var posts = _context.Posts.ToList();
            return View(posts);
        }

        // 2. CHI TIẾT BÀI VIẾT
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();
            return View(post);
        }

        // 3. THÊM BÀI VIẾT (GET - Hiển thị Form)
        public IActionResult Create()
        {
            // Thay vì dùng SelectList, truyền thẳng List thô từ database sang View
            List<Category> categories = _context.Categories.ToList();
            ViewBag.Categories = categories;

            return View();
        }

        // 3. THÊM BÀI VIẾT (POST - Xử lý lưu)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Post post, IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "posts");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                post.ImageUrl = "/images/posts/" + uniqueFileName;
            }
            else
            {
                post.ImageUrl = "https://via.placeholder.com/600x300";
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // 4. SỬA BÀI VIẾT (GET)
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Truyền danh sách cho trang chỉnh sửa tương tự trang Create
            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        // 4. SỬA BÀI VIẾT (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post post, IFormFile? imageFile)
        {
            if (id != post.Id) return NotFound();

            if (imageFile != null && imageFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "posts");
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                post.ImageUrl = "/images/posts/" + uniqueFileName;
            }

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // 5. XÓA BÀI VIẾT
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}