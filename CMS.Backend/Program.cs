// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Cấu hình dịch vụ hệ thống và Kích hoạt Middleware Authentication cho Buổi 5
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies; // Thêm thư viện quản lý Cookie Auth

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký dịch vụ Database SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. CẬP NHẬT BUỔI 5: Đăng ký dịch vụ bảo mật Authentication bằng Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";         // Nếu chưa đăng nhập -> Tự đẩy về trang này
        options.AccessDeniedPath = "/Account/AccessDenied"; // Nếu sai quyền hạn -> Tự đẩy về trang này
    });

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Cấu hình Middleware hệ thống
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 3. CẬP NHẬT BUỔI 5: Kích hoạt Middleware xác thực (Bắt buộc đứng trước Authorization)
app.UseAuthentication(); // Xác nhận danh tính người dùng (Anh là ai?)
app.UseAuthorization();  // Xác nhận quyền hạn người dùng (Anh được làm gì?)

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();