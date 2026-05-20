using Microsoft.EntityFrameworkCore;
using CMS.Data; // Chỉ dùng CMS.Data vì Namespace của file DbContext là CMS.Data

var builder = WebApplication.CreateBuilder(args);

// Đăng ký dịch vụ Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Các cấu hình Middleware (giữ nguyên của bạn)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();