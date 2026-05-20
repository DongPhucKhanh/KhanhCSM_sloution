//Họ và tên: Đồng Phúc Khánh 
//    MSSV: 2123110051
//    version: 1.0
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data; // Kết nối tới lớp dữ liệu bạn vừa tạo

public class CategoryController : Controller
{
    private readonly ApplicationDbContext _context;

    // "Tiêm" kết nối vào Controller
    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Lấy dữ liệu THẬT từ bảng Categories trong SQL
        var data = _context.Categories.ToList();
        return View(data);
    }
}

