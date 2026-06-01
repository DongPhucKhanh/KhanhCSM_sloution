// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: API lấy danh sách danh mục sản phẩm thời trang phục vụ bộ lọc ReactJS (Đã sửa lỗi thuộc tính thừa)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy toàn bộ danh mục sản phẩm thời trang (Giao thức GET)
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/CategoriesProducts
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Bước A: Quét bảng dữ liệu CategoriesProducts số nhiều dưới SQL Server lên
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.Id) // ĐỒNG BỘ: Sắp xếp theo Id tăng dần vì entity không có DisplayOrder
                    .Select(c => new {
                        // Bước B: Kỹ thuật gọt tỉa (Projection) - Chỉ giữ lại những trường THẬT SỰ CÓ trong entity của bạn
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                // Bước C: Trả về mã thành công HTTP 200 OK đính kèm chuỗi chữ JSON sạch
                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống",
                    detail = ex.Message
                });
            }
        }
    }
}