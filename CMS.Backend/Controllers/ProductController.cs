// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Thêm - Sửa - Xóa Sản phẩm (CRUD) liên kết trực tiếp CategoriesProducts + Bảo mật Buổi 6 + Tích hợp Phân trang
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // Hỗ trợ tạo SelectList cho các thẻ dropdown (thẻ chọn thả xuống)
using Microsoft.EntityFrameworkCore; // Thư viện lõi xử lý CSDL, cung cấp Include, AsNoTracking, EF LINQ
using CMS.Data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Hosting; // Cung cấp IWebHostEnvironment để tương tác với thư mục tĩnh (wwwroot)
using Microsoft.AspNetCore.Http; // Cung cấp IFormFile để nhận file ảnh người dùng tải lên
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bảo mật Buổi 5: Ngăn chặn khách vãng lai, yêu cầu phải đăng nhập mới được vào trang quản trị này
    public class ProductController : Controller
    {
        // Khai báo biến read-only lưu trữ ngữ cảnh kết nối Database và môi trường Server
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        // DI (Dependency Injection): Tiêm tự động DbContext và WebHostEnvironment vào Controller
        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // ==============================================================================
        // 1. DANH SÁCH SẢN PHẨM + TÌM KIẾM + LỌC DANH MỤC + PHÂN TRANG (Pagination)
        // ==============================================================================
        // Nhận 3 tham số từ URL: Từ khóa tìm kiếm, ID danh mục cần lọc, và Số trang hiện tại (Mặc định = 1)
        public IActionResult Index(string searchString, int? categoryProductId, int page = 1)
        {
            // BƯỚC 1: XÂY DỰNG TRUY VẤN GỐC
            // Dùng AsQueryable() để hoãn việc thực thi lệnh SQL. Nó giúp ta cộng dồn các điều kiện lọc (Where) ở dưới
            // trước khi thực sự chọc xuống SQL Server để lấy dữ liệu lên.
            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            // BƯỚC 2: ÁP DỤNG CÁC ĐIỀU KIỆN LỌC
            // Nếu người dùng có gõ chữ vào thanh tìm kiếm
            if (!string.IsNullOrEmpty(searchString))
            {
                // Dùng Contains để tìm kiếm gần đúng (như toán tử LIKE '%searchString%' trong SQL)
                query = query.Where(p => p.Name.Contains(searchString));
            }

            // Nếu người dùng có chọn một danh mục cụ thể từ thẻ dropdown
            if (categoryProductId.HasValue)
            {
                // Lọc những sản phẩm có mã danh mục khớp với mã người dùng chọn
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            // BƯỚC 3: XỬ LÝ TOÁN HỌC CHO PHÂN TRANG (Áp dụng trên dữ liệu ĐÃ LỌC)
            int pageSize = 4; // Cấu hình 1 trang sẽ hiển thị tối đa 4 sản phẩm

            // Đếm tổng số sản phẩm thỏa mãn điều kiện lọc để tính số trang
            int totalProducts = query.Count();

            // Tính số trang cần thiết: (Ví dụ 10 / 4 = 2.5 -> Làm tròn lên là 3 trang)
            int totalPages = (int)Math.Ceiling((double)totalProducts / pageSize);

            // Xử lý an toàn: Không cho phép số trang nhỏ hơn 1 hoặc lớn hơn tổng số trang hiện có
            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            // BƯỚC 4: THỰC THI CẮT MẢNG DỮ LIỆU
            // Lưu ý quan trọng: EF Core bắt buộc phải có lệnh sắp xếp (OrderBy) trước khi dùng Skip/Take
            var filteredProducts = query.OrderByDescending(p => p.Id) // Sắp xếp giảm dần theo ID (Sản phẩm mới đưa lên đầu)
                                        .Skip((page - 1) * pageSize)  // Bỏ qua số lượng sản phẩm của các trang trước đó
                                        .Take(pageSize)               // Chỉ lấy đúng 4 sản phẩm cho trang hiện tại
                                        .ToList(); // ToList() lúc này mới chính thức bắn lệnh chọc xuống SQL Server

            // BƯỚC 5: ĐÓNG GÓI DỮ LIỆU ĐẨY SANG GIAO DIỆN HTML (VIEW)
            // Lấy danh sách chuyên mục thật để vẽ ra các <option> cho thẻ tìm kiếm
            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();

            // Đẩy lại từ khóa tìm kiếm và ID danh mục đang chọn ra View để giữ trạng thái (Không bị mất chữ khi sang trang 2)
            ViewBag.CurrentSearch = searchString;
            ViewBag.CurrentCategory = categoryProductId;

            // Truyền thông số trang hiện tại và tổng số trang để vẽ nút bấm 1 2 3
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(filteredProducts); // Trả mảng sản phẩm cuối cùng về View
        }

        // ==============================================================================
        // 2. FORM THÊM MỚI SẢN PHẨM (GET) - Hiển thị giao diện nhập liệu
        // ==============================================================================
        [HttpGet]
        public IActionResult Create()
        {
            // Kiểm tra phân quyền: Chỉ tài khoản có Role là "Admin" mới được phép truy cập
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            // Nạp danh sách chuyên mục và đóng gói vào SelectList để giao diện tự động vẽ thẻ Dropdown
            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name");
            return View();
        }

        // ==============================================================================
        // 2. XỬ LÝ LƯU SẢN PHẨM MỚI (POST) - Nhận dữ liệu từ giao diện gửi lên
        // ==============================================================================
        [HttpPost]
        [ValidateAntiForgeryToken] // Chống giả mạo request từ trang web khác
        public async Task<IActionResult> Create(Product product, IFormFile? imageFile)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            // Kỹ thuật gỡ lỗi Model Validation: Bỏ qua kiểm tra ràng buộc tự động đối với các trường 
            // liên kết ảo (CategoryProduct) và các trường thao tác file để không bị kẹt Form
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("imageFile");

            if (ModelState.IsValid) // Nếu dữ liệu chữ (Tên, giá, mô tả...) hợp lệ
            {
                // Kiểm tra xem Admin có đính kèm file ảnh lên không
                if (imageFile != null && imageFile.Length > 0)
                {
                    product.ImageUrl = await SaveImage(imageFile); // Gọi hàm phụ trợ lưu file và lấy link
                }
                else
                {
                    // Nếu Admin không up ảnh, tự động gắn link ảnh mặc định có sẵn
                    product.ImageUrl = "/images/products/default-product.jpg";
                }

                _context.Products.Add(product); // Đưa dữ liệu vào danh sách chờ
                await _context.SaveChangesAsync(); // Lưu dữ liệu thực tế xuống SQL Server
                return RedirectToAction(nameof(Index)); // Chuyển hướng về lại danh sách sản phẩm
            }

            // Nếu dữ liệu lỗi, nạp lại danh mục vào ViewBag để form không bị lỗi mất thẻ select
            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product); // Trả lại form kèm cảnh báo đỏ
        }

        // ==============================================================================
        // 3. FORM CHỈNH SỬA SẢN PHẨM (GET)
        // ==============================================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            var product = _context.Products.Find(id); // Tìm sản phẩm theo mã ID
            if (product == null) return NotFound(); // Báo lỗi 404 nếu không tìm thấy

            var productCategories = _context.CategoriesProducts.ToList();
            // Nạp danh mục vào SelectList và chọn sẵn (selected) danh mục hiện tại của sản phẩm
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==============================================================================
        // 3. XỬ LÝ CẬP NHẬT SẢN PHẨM (POST)
        // ==============================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product, IFormFile? imageFile)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");
            if (id != product.Id) return NotFound(); // Chống hack đổi ID sản phẩm qua F12 (Inspect Element)

            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("imageFile");

            if (ModelState.IsValid)
            {
                try
                {
                    // Kỹ thuật AsNoTracking: Rất quan trọng khi Update.
                    // Bốc sản phẩm gốc từ CSDL lên chỉ để ĐỌC đường dẫn ảnh cũ, yêu cầu EF Core KHÔNG THEO DÕI
                    // sự thay đổi của biến existingProduct này. Việc này giúp tránh xung đột với biến 'product' đang truyền vào.
                    var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == id);
                    if (existingProduct == null) return NotFound();

                    // Xử lý đổi ảnh mới
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        product.ImageUrl = await SaveImage(imageFile); // Lưu file mới và lấy link mới
                    }
                    else
                    {
                        product.ImageUrl = existingProduct.ImageUrl; // Lấy link ảnh cũ đắp vào để không bị mất ảnh
                    }

                    _context.Products.Update(product); // Ghi đè thông tin mới
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException) // Bắt lỗi tranh chấp dữ liệu (Ví dụ 2 Admin cùng sửa 1 SP)
                {
                    // Kiểm tra xem sản phẩm có bị Admin khác xóa mất tiêu trong lúc ta đang sửa không
                    if (!_context.Products.Any(e => e.Id == product.Id)) return NotFound();
                    else throw; // Nếu lỗi khác thì ném ra hệ thống
                }
            }

            var productCategories = _context.CategoriesProducts.ToList();
            ViewBag.CategoryProductId = new SelectList(productCategories, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==============================================================================
        // 4. THAO TÁC XÓA SẢN PHẨM
        // ==============================================================================
        public IActionResult Delete(int id)
        {
            if (!User.IsInRole("Admin")) return RedirectToAction("AccessDenied", "Account");

            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product); // Đánh dấu xóa thực thể
                _context.SaveChanges(); // Đồng bộ lệnh DELETE xuống SQL Server
            }
            return RedirectToAction(nameof(Index));
        }

        // ==============================================================================
        // HÀM PHỤ TRỢ: Xử lý vật lý lưu tệp tin ảnh từ RAM xuống ổ cứng Server
        // ==============================================================================
        private async Task<string> SaveImage(IFormFile file)
        {
            // Định vị đường dẫn tuyệt đối đến thư mục wwwroot/images/products
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "products");

            // Nếu thư mục chưa có thì tự động tạo mới
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            // Băm thêm chuỗi ngẫu nhiên Guid vào trước tên ảnh để đảm bảo 100% không bao giờ trùng tên đè file
            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);

            // Tạo đường dẫn file hoàn chỉnh
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Mở luồng ghi dữ liệu nhị phân (FileStream) và copy file vào
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Trả về đường dẫn tương đối (để lưu vào SQL Server và render trên thẻ <img>)
            return "/images/products/" + uniqueFileName;
        }
    }
}