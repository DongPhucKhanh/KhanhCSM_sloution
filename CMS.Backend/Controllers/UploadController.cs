// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: API nhận file ảnh từ CKEditor, lưu vào wwwroot/uploads/, trả về URL
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Chỉ Admin/Editor đã đăng nhập mới được upload ảnh
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public UploadController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // POST: api/Upload/Image
        // CKEditor gửi file ảnh lên đây, controller lưu vào wwwroot/uploads/ và trả về URL
        [HttpPost("Image")]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
                return BadRequest(new { error = new { message = "Không có file nào được gửi lên!" } });

            // Kiểm tra định dạng file hợp lệ
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(upload.FileName).ToLowerInvariant();
            if (!Array.Exists(allowedExtensions, ext => ext == extension))
                return BadRequest(new { error = new { message = "Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .gif, .webp" } });

            // Tạo thư mục wwwroot/uploads nếu chưa tồn tại
            var uploadFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // Đặt tên file duy nhất bằng GUID để tránh trùng lặp
            var uniqueFileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            // Lưu file xuống ổ cứng máy chủ
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }

            // Trả về đúng cấu trúc JSON mà CKEditor 5 yêu cầu
            var fileUrl = $"/uploads/{uniqueFileName}";
            return Ok(new { url = fileUrl });
        }
    }
}
