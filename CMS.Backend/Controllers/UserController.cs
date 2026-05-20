using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    // Họ và tên: Đồng Phúc Khánh 
    // MSSV: 2123110051
    // Chức năng: Quản lý người dùng (User Management)
    public class UserController : Controller
    {
        // Hàm Index: Hiển thị danh sách người dùng mẫu
        public IActionResult Index()
        {
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "khanh.dong",
                    FullName = "Đồng Phúc Khánh",
                    Email = "khanh.dp212311@sinhvien.edu.vn",
                    Role = "Administrator",
                    IsActive = true,
                    CreatedDate = DateTime.Now.AddDays(-30)
                },
                new User
                {
                    Id = 2,
                    Username = "teacher.nguyen",
                    FullName = "Nguyễn Văn Giảng Viên",
                    Email = "giangvien@cms.edu.vn",
                    Role = "Editor",
                    IsActive = true,
                    CreatedDate = DateTime.Now.AddDays(-15)
                },
                new User
                {
                    Id = 3,
                    Username = "guest.user",
                    FullName = "Người dùng thử nghiệm",
                    Email = "guest@gmail.com",
                    Role = "Viewer",
                    IsActive = false,
                    CreatedDate = DateTime.Now
                }
            };

            return View(users);
        }
    }
}