//Họ và tên: Đồng Phúc Khánh 
//    MSSV: 2123110051
//    version: 1.1
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data; // Kết nối tới lớp dữ liệu bạn vừa tạo
using System.Linq;

public class CategoryController : Controller
{
    private readonly ApplicationDbContext _context;

    // "Tiêm" kết nối dữ liệu vào Controller
    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 1. DANH SÁCH DANH MỤC (READ)
    public IActionResult Index()
    {
        // Lấy dữ liệu THẬT từ bảng Categories trong SQL
        var data = _context.Categories.ToList();
        return View(data);
    }

    // 2. THÊM MỚI (CREATE - GET: Hiển thị Form nhập liệu)
    public IActionResult Create()
    {
        return View();
    }

    // 2. THÊM MỚI (CREATE - POST: Xử lý lưu dữ liệu từ Form vào SQL)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(Category category)
    {
        // Bỏ qua ModelState.IsValid để tránh lỗi kẹt trang khi dữ liệu quan hệ bị trống
        _context.Categories.Add(category);
        _context.SaveChanges(); // Lưu trực tiếp vào SQL Server

        // Sau khi lưu thành công, lập tức chuyển hướng về trang danh sách
        return RedirectToAction(nameof(Index));
    }

    // 3. SỬA DANH MỤC (EDIT - GET: Lấy dữ liệu cũ đổ lên Form)
    public IActionResult Edit(int id)
    {
        var category = _context.Categories.Find(id);
        if (category == null)
        {
            return NotFound();
        }
        return View(category);
    }

    // 3. SỬA DANH MỤC (EDIT - POST: Xử lý cập nhật vào SQL)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Edit(int id, Category category)
    {
        if (id != category.Id)
        {
            return NotFound();
        }

        // Ép cập nhật thẳng dữ liệu thay đổi vào Database
        _context.Categories.Update(category);
        _context.SaveChanges();

        return RedirectToAction(nameof(Index));
    }

    // 4. XÓA DANH MỤC (DELETE - GET: Xóa nhanh qua ID)
    public IActionResult Delete(int id)
    {
        var category = _context.Categories.Find(id);
        if (category != null)
        {
            _context.Categories.Remove(category);
            _context.SaveChanges(); // Xác nhận xóa khỏi Database
        }
        return RedirectToAction(nameof(Index));
    }
}