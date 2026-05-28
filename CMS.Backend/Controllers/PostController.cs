// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý CRUD Bài viết tích hợp xử lý Tải ảnh trực tiếp từ máy tính (Choose File)
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // Thư viện bắt buộc để dùng IFormFile nhận file ảnh
using Microsoft.AspNetCore.Hosting; // Thư viện để định vị thư mục wwwroot
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bảo mật Buổi 5: Yêu cầu đăng nhập mới được vào quản lý bài viết
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // Khai báo môi trường để lấy đường dẫn lưu tệp

        // Tiêm cả DbContext và WebHostEnvironment vào Constructor hệ thống
        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // 1. DANH SÁCH BÀI VIẾT (Index)
        public IActionResult Index()
        {
            // Dùng Include để bốc kèm theo dữ liệu của bảng Category thật (Hiển thị tên danh mục)
            var posts = _context.Posts.Include(p => p.Category).ToList();
            return View(posts);
        }

        // 2. CHI TIẾT BÀI VIẾT (Details)
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // 3. FORM THÊM BÀI VIẾT MỚI (GET)
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách danh mục thật đổ vào ViewBag để người dùng chọn trên thẻ <select>
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        // 3. XỬ LÝ LƯU BÀI VIẾT MỚI VÀ UPLOAD FILE (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Post model, IFormFile ImageFile)
        {
            // GIẢI QUYẾT TẬN GỐC LỖI KẸT FORM: Gỡ bỏ kiểm tra tự động trường liên kết ảo và trường đường dẫn chuỗi
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                // Xử lý Upload ảnh vật lý trực tiếp từ máy tính khi người dùng bấm Choose File
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    // Xác định đường dẫn và tạo thư mục "uploads" trong wwwroot nếu chưa có
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Đổi tên tệp ảnh bằng chuỗi ngẫu nhiên Guid để tránh trùng tên đè file trên máy
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    string filePath = Path.Combine(uploadDir, fileName);

                    // Ghi file vật lý vào thư mục wwwroot/uploads của dự án
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(fileStream);
                    }

                    // Lưu đường dẫn tương đối vào trường ImageUrl của SQL Server để phục vụ hiển thị
                    model.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    // Ảnh mặc định nếu người dùng không chọn tệp tin nào
                    model.ImageUrl = "/uploads/default.jpg";
                }

                model.CreatedDate = DateTime.Now;
                _context.Posts.Add(model);
                await _context.SaveChangesAsync(); // Đẩy dữ liệu thật xuống Database
                return RedirectToAction(nameof(Index));
            }

            // Nếu dữ liệu form dính lỗi khác, nạp lại danh sách danh mục và trả về view kèm thông báo
            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        // 4. FORM SỬA BÀI VIẾT (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        // 4. XỬ LÝ CẬP NHẬT BÀI VIẾT VÀ ĐỔI FILE ẢNH (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post model, IFormFile ImageFile)
        {
            if (id != model.Id) return NotFound();

            // Gỡ bỏ kiểm tra ràng buộc trường liên kết ảo tương tự hành động Thêm mới
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                try
                {
                    // Truy vấn dữ liệu thực thể gốc không theo dấu (AsNoTracking) để tránh xung đột ngữ cảnh EF
                    var existingPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == id);
                    if (existingPost == null) return NotFound();

                    if (ImageFile != null && ImageFile.Length > 0)
                    {
                        string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                        if (!Directory.Exists(uploadDir))
                        {
                            Directory.CreateDirectory(uploadDir);
                        }

                        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                        string filePath = Path.Combine(uploadDir, fileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await ImageFile.CopyToAsync(fileStream);
                        }

                        model.ImageUrl = "/uploads/" + fileName; // Lưu đường dẫn ảnh mới chọn từ máy tính
                    }
                    else
                    {
                        // ĐỒNG BỘ LOGIC: Ép lấy lại đường dẫn ảnh cũ chính xác từ DB gốc phòng hờ thẻ hidden đẩy chuỗi sai
                        model.ImageUrl = existingPost.ImageUrl;
                    }

                    // Thực hiện cập nhật trạng thái thực thể đổi mới
                    _context.Posts.Update(model);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Posts.Any(e => e.Id == model.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        // 5. THAO TÁC XÓA BÀI VIẾT
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