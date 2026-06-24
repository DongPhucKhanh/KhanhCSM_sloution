// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: API sản phẩm cho Frontend: lấy tất cả, lọc danh mục, xem chi tiết, tìm kiếm, mới nhất, bán chạy
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET /api/products - Lấy tất cả sản phẩm
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                    p.CategoryProductId,
                    categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();
            return Ok(products);
        }

        // 2. GET /api/products/categoryproduct/{id} - Lọc theo danh mục
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                    p.CategoryProductId,
                    categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();
            return Ok(products);
        }

        // 3. GET /api/products/{id} - Chi tiết sản phẩm
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                    p.CategoryProductId,
                    categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });

            return Ok(product);
        }

        // 4. GET /api/products/search?q=keyword - Tìm kiếm sản phẩm (Tiêu chí 40)
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new object[] { });

            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Name.Contains(q) || (p.Description != null && p.Description.Contains(q)))
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                    p.CategoryProductId,
                    categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // 5. GET /api/products/newest?limit=3 - Sản phẩm mới nhất (Tiêu chí 36)
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewest([FromQuery] int limit = 3)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id) // ID cao nhất = mới nhất
                .Take(limit)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                    p.CategoryProductId,
                    categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // 6. GET /api/products/bestseller?limit=3 - Sản phẩm bán chạy nhất (Tiêu chí 37)
        // Tính toán từ tổng số lượng trong OrderDetail
        [HttpGet("bestseller")]
        public async Task<IActionResult> GetBestseller([FromQuery] int limit = 3)
        {
            var bestsellers = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(od => od.Quantity) })
                .OrderByDescending(x => x.TotalSold)
                .Take(limit)
                .Join(_context.Products.Include(p => p.CategoryProduct),
                      sold => sold.ProductId,
                      product => product.Id,
                      (sold, product) => new {
                          product.Id, product.Name, product.Description,
                          product.Price, product.StockQuantity, product.ImageUrl,
                          product.CategoryProductId,
                          categoryName = product.CategoryProduct != null ? product.CategoryProduct.Name : "",
                          totalSold = sold.TotalSold
                      })
                .ToListAsync();

            // Nếu chưa có đơn hàng nào, fallback về sản phẩm mới nhất
            if (!bestsellers.Any())
            {
                var fallback = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .OrderByDescending(p => p.Id)
                    .Take(limit)
                    .Select(p => new {
                        p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.ImageUrl,
                        p.CategoryProductId,
                        categoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "",
                        totalSold = 0
                    })
                    .ToListAsync();
                return Ok(fallback);
            }

            return Ok(bestsellers);
        }
    }
}