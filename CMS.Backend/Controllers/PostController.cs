// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý CRUD Bài viết tích hợp xử lý Tải ảnh trực tiếp từ máy tính và Phân trang (Pagination)
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // Thư viện bắt buộc để dùng IFormFile nhận file ảnh từ Client gửi lên
using Microsoft.AspNetCore.Hosting; // Thư viện để định vị đường dẫn vật lý của thư mục wwwroot trên ổ cứng
using Microsoft.EntityFrameworkCore; // Thư viện cung cấp các hàm Include để kết nối bảng dữ liệu (Join bốc kèm danh mục)
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.IO; // Thư viện xử lý đọc/ghi tập tin và thư mục (Directory, Path, FileStream)
using System.Linq; // Thư viện chứa các hàm truy vấn dữ liệu mạnh mẽ (Count, OrderBy, Skip, Take)
using System.Threading.Tasks; // Thư viện hỗ trợ lập trình bất đồng bộ (async/await) tránh nghẽn luồng xử lý của Server

namespace CMS.Backend.Controllers
{
    [Authorize] // Cơ chế bảo mật: Bắt buộc người dùng phải đăng nhập tài khoản thành công mới có quyền truy cập vào Controller này
    public class PostController : Controller
    {
        // Khai báo 2 biến read-only để lưu trữ ngữ cảnh CSDL và môi trường lưu trữ tệp tin
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        // Cơ chế Dependency Injection (Tiêm phụ thuộc): Kỹ thuật tự động nạp ApplicationDbContext và IWebHostEnvironment
        // khi Controller này được khởi tạo mà không cần dùng từ khóa 'new' thủ công.
        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // ==============================================================================
        // 1. DANH SÁCH BÀI VIẾT (Index) - ĐÃ TÍCH HỢP TÍNH NĂNG PHÂN TRANG 4 BÀI/TRANG
        // ==============================================================================
        // Tham số page nhận vào số trang hiện tại từ thanh URL (Ví dụ: /Post/Index?page=2). Mặc định nếu không truyền sẽ là trang 1.
        public IActionResult Index(int page = 1)
        {
            int pageSize = 4; // Cấu hình số lượng bản ghi tối đa muốn hiển thị trên một trang

            // Đếm tổng số lượng dòng (bài viết) đang tồn tại trong bảng Posts dưới SQL Server
            int totalPosts = _context.Posts.Count();

            // Công thức toán học tính tổng số trang: Lấy tổng số bài chia cho kích thước trang và làm tròn lên (Math.Ceiling)
            // Ép kiểu (double) để phép chia có phần thập phân trước khi làm tròn, sau đó ép về kiểu (int) để lấy số nguyên
            int totalPages = (int)Math.Ceiling((double)totalPosts / pageSize);

            // Phòng thủ dữ liệu (Validation phòng ngừa ngoại lệ): 
            // Nếu số trang truyền vào nhỏ hơn 1 thì ép về trang 1.
            if (page < 1) page = 1;
            // Nếu số trang vượt quá tổng số trang hiện có thì ép về trang cuối cùng.
            if (page > totalPages && totalPages > 0) page = totalPages;

            // Thuật toán phân trang bằng LINQ đâm thẳng xuống cơ sở dữ liệu:
            var posts = _context.Posts
                                .Include(p => p.Category) // Kỹ thuật Eager Loading: Tự động INNER JOIN với bảng danh mục để lấy kèm tên chủ đề bài viết
                                .OrderByDescending(p => p.CreatedDate) // Sắp xếp theo ngày tạo giảm dần (Bài mới viết hiển thị lên đầu)
                                .Skip((page - 1) * pageSize) // Thuật toán Skip: Bỏ qua (page - 1) * pageSize bản ghi đầu tiên của các trang trước
                                .Take(pageSize) // Thuật toán Take: Trích xuất đúng số lượng pageSize (4 bài) cho trang hiện tại
                                .ToList(); // Chuyển đổi toàn bộ kết quả truy vấn thành một danh sách (Mảng dữ liệu cụ thể)

            // Dùng ViewBag để đóng gói các thông số điều hướng dòng chảy dữ liệu sang file Index.cshtml vẽ giao diện nút bấm
            ViewBag.CurrentPage = page; // Trang hiện tại khách đang xem
            ViewBag.TotalPages = totalPages; // Tổng số trang đang có trong kho

            return View(posts); // Trả mảng 4 bài viết về cho View hiển thị lên màn hình Admin
        }

        // ==============================================================================
        // 2. CHI TIẾT BÀI VIẾT (Details)
        // ==============================================================================
        public IActionResult Details(int id)
        {
            // Tìm bài viết đầu tiên khớp với mã id truyền vào, đồng thời kết nối bảng lấy thông tin danh mục
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy mã bài viết này trong hệ thống -> Trả về lỗi 404 Standard
            if (post == null) return NotFound();

            return View(post); // Trả thực thể bài viết tìm được về View hiển thị chi tiết nội dung
        }

        // ==============================================================================
        // 3. FORM THÊM BÀI VIẾT MỚI (GET)
        // ==============================================================================
        [HttpGet] // Phương thức hiển thị giao diện Form trống cho người dùng nhập liệu
        public IActionResult Create()
        {
            // Truy vấn lấy toàn bộ danh sách danh mục trong Database đổ vào ViewBag
            // Mục đích: Phục vụ render dữ liệu cho thẻ chọn thả xuống <select> ngoài giao diện HTML
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        // ==============================================================================
        // 3. XỬ LÝ LƯU BÀI VIẾT MỚI VÀ UPLOAD FILE (POST)
        // ==============================================================================
        [HttpPost] // Phương thức nhận dữ liệu submit từ Form đẩy lên Server
        [ValidateAntiForgeryToken] // Cơ chế bảo mật chống tấn công giả mạo yêu cầu chéo trang (CSRF Attack)
        public async Task<IActionResult> Create(Post model, IFormFile? ImageFile)
        {
            // Kỹ thuật gỡ lỗi kẹt Form (Model Validation Bypass):
            // Ép hệ thống bỏ qua việc kiểm tra tính hợp lệ tự động đối với các thực thể liên kết ảo và tệp tin tệp ảnh
            // để tránh lỗi ModelState.IsValid bị false vô lý khi dữ liệu thô đã đầy đủ.
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("ImageFile");

            if (ModelState.IsValid) // Nếu toàn bộ dữ liệu nhập liệu trên Form đã vượt qua các vòng kiểm tra ràng buộc
            {
                // KIỂM TRA: Nếu người dùng có bấm nút "Choose File" chọn tệp tin ảnh từ máy tính
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    // Hàm Path.Combine kết hợp các chuỗi đường dẫn vật lý để định vị thư mục lưu trữ: wwwroot/uploads
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");

                    // Nếu thư mục "uploads" chưa từng tồn tại trên ổ cứng Server, tiến hành tạo mới thư mục
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Kỹ thuật đặt tên file chống trùng đè (Unique File Name):
                    // Tạo ra một chuỗi chuỗi ngẫu nhiên không trùng lặp (Guid.NewGuid) và ghép nối với đuôi file gốc (.jpg, .png, ...)
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);

                    // Tạo đường dẫn tuyệt đối đến tệp tin đích trên đĩa cứng Server
                    string filePath = Path.Combine(uploadDir, fileName);

                    // Khởi tạo luồng ghi file (FileStream): Tạo mới một tệp tin trống tại filePath trên Server
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        // Sao chép toàn bộ dữ liệu nhị phân của file ảnh từ luồng mạng vào file trống vừa tạo trên Server
                        await ImageFile.CopyToAsync(fileStream);
                    }

                    // Ghi nhận đường dẫn tương đối (Relative Path) vào trường dữ liệu của thực thể để lưu xuống Database
                    model.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    // Trường hợp dự phòng: Nếu người dùng bỏ trống không chọn ảnh, tự động gán ảnh mặc định có sẵn hệ thống
                    model.ImageUrl = "/uploads/default.jpg";
                }

                model.CreatedDate = DateTime.Now; // Gán mốc thời gian tạo bài viết là thời điểm hiện tại của Server
                _context.Posts.Add(model); // Đưa thực thể model bài viết vào hàng chờ của ngữ cảnh EF Core
                await _context.SaveChangesAsync(); // Thực thi lệnh INSERT đổ toàn bộ dữ liệu thật vào SQL Server
                return RedirectToAction(nameof(Index)); // Chuyển hướng trình duyệt về lại trang danh sách bài viết
            }

            // Nếu dữ liệu Form dính lỗi kiểm định, nạp lại danh sách danh mục vào ViewBag để Form không bị lỗi trắng thẻ select
            ViewBag.Categories = _context.Categories.ToList();
            return View(model); // Trả lại View kèm dữ liệu cũ khách đã nhập để họ sửa lỗi mà không phải nhập lại từ đầu
        }

        // ==============================================================================
        // 4. FORM SỬA BÀI VIẾT (GET)
        // ==============================================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm kiếm bài viết trong Database theo khóa chính id
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound(); // Trả về lỗi 404 nếu mã id không tồn tại

            // Nạp danh sách danh mục ra giao diện để ô chọn Select hiển thị đúng nhóm chuyên mục của bài viết cũ
            ViewBag.Categories = _context.Categories.ToList();
            return View(post); // Bung dữ liệu cũ của bài viết lên các ô Form nhập liệu
        }

        // ==============================================================================
        // 4. XỬ LÝ CẬP NHẬT BÀI VIẾT VÀ ĐỔI FILE ẢNH (POST)
        // ==============================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post model, IFormFile? ImageFile)
        {
            // Kiểm tra an toàn: Mã id trên thanh URL phải khớp chính xác với mã id của thực thể nằm trong Form gửi lên
            if (id != model.Id) return NotFound();

            // Tiếp tục gỡ lỗi kẹt kiểm định Form giống như hàm Create
            ModelState.Remove("ImageFile");
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                try
                {
                    // Kỹ thuật ngắt theo dấu thực thể (AsNoTracking): 
                    // Truy vấn bốc bài viết gốc từ DB lên để đọc đường dẫn ảnh cũ mà không cho EF theo dõi chỉnh sửa dòng này.
                    // Điều này giúp ngăn chặn triệt để lỗi xung đột ngữ cảnh (DbUpdateConcurrencyException) khi gọi lệnh cập nhật ở dưới.
                    var existingPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == id);
                    if (existingPost == null) return NotFound();

                    // XỬ LÝ ẢNH THAY ĐỔI: Nếu người dùng có chọn file ảnh mới thay thế ảnh cũ
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

                        model.ImageUrl = "/uploads/" + fileName; // Gán đường dẫn ảnh mới tinh vừa tải lên
                    }
                    else
                    {
                        // Kỹ thuật giữ nguyên ảnh cũ: Nếu người dùng sửa nội dung chữ mà không chọn ảnh mới,
                        // ta ép gán lại đường dẫn ảnh cũ đã bốc từ DB lên (`existingPost.ImageUrl`) vào model để không bị mất ảnh.
                        model.ImageUrl = existingPost.ImageUrl;
                    }

                    _context.Posts.Update(model); // Đánh dấu thực thể model này đã bị thay đổi cấu trúc dữ liệu chữ
                    await _context.SaveChangesAsync(); // Kích hoạt lệnh UPDATE đồng bộ dữ liệu mới xuống SQL Server
                    return RedirectToAction(nameof(Index)); // Quay về lại trang danh sách bài viết quản trị
                }
                catch (DbUpdateConcurrencyException) // Bắt lỗi ngoại lệ bất đồng bộ đồng thời dữ liệu (Lỗi tranh chấp sửa DB)
                {
                    // Kiểm tra hờ xem trong lúc đang xử lý, bài viết này có vô tình bị ai khác xóa mất dưới DB chưa
                    if (!_context.Posts.Any(e => e.Id == model.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw; // Nếu bài viết vẫn tồn tại mà lỗi cập nhật, quăng lỗi ra hệ thống truy vết
                    }
                }
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        // ==============================================================================
        // 5. THAO TÁC XÓA BÀI VIẾT
        // ==============================================================================
        public IActionResult Delete(int id)
        {
            // Tìm bài viết cần xóa trong CSDL theo mã id khóa chính
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post); // Đánh dấu thực thể bài viết này nằm trong danh sách chuẩn bị xóa bỏ
                _context.SaveChanges(); // Kích hoạt lệnh DELETE đồng bộ xóa vĩnh viễn dòng này ra khỏi SQL Server
            }
            return RedirectToAction(nameof(Index)); // Xóa xong tự động tải lại trang danh sách bài viết mới
        }
    }
}