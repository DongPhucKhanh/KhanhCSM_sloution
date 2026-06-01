// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Cấu hình dịch vụ hệ thống, Kích hoạt Cookie Auth (Buổi 5) và Tích hợp Kiến trúc lai Web API & Swagger (Buổi 6)
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

builder.Services.AddControllersWithViews(); // Lệnh giữ quyền biên dịch View (.cshtml) cũ và nhận diện API mới

// ==============================================================
// BỔ SUNG BUỔI 6 - PHẦN 1: ĐĂNG KÝ DỊCH VỤ WEB API, SWAGGER & CORS
// ==============================================================
// Đăng ký dịch vụ lõi giúp hệ thống tự động bóc tách thông tin Endpoint phục vụ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Kích hoạt bộ sinh tài liệu API Swagger

// Đăng ký chính sách CORS để bật đèn xanh cho ReactJS kết nối ở các buổi sau
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==============================================================
// KÍCH HOẠT MIDDLEWARE SWAGGER CỦA BUỔI 6
// ==============================================================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    c.RoutePrefix = "swagger"; // Đường dẫn truy cập mặc định sẽ là /swagger
});

// Cấu hình Middleware hệ thống cũ
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// ==============================================================
// KÍCH HOẠT MIDDLEWARE CORS CỦA BUỔI 6 (BẮT BUỘC ĐẶT ĐÚNG VỊ TRÍ)
// Khớp quy tắc chuyên đề: Nằm ngay giữa UseRouting và app.UseAuthentication()
// ==============================================================
app.UseCors("AllowAll");

// 3. CẬP NHẬT BUỔI 5: Kích hoạt Middleware xác thực (Bắt buộc đứng trước Authorization)
app.UseAuthentication(); // Xác nhận danh tính người dùng (Anh là ai?)
app.UseAuthorization();  // Xác nhận quyền hạn người dùng (Anh được làm gì?)

// ===============================================================
// ĐỊNH TUYẾN PHÂN LUỒNG SONG HÀNH HYBRID (BUỔI 6)
// ===============================================================
// Phân luồng A: Ánh xạ các Endpoint API tuân thủ theo cấu trúc [Route("api/[controller]")]
app.MapControllers();

// Phân luồng B: Giữ lại bản đồ đường đi mặc định cho trang giao diện Web MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();