using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    // Họ và tên: Đồng Phúc Khánh 
    // MSSV: 2123110051
    // Version: 1.0
    public class PostController : Controller
    {
        // Hàm Index: Hiển thị danh sách bài viết mẫu
        public IActionResult Index()
        {
            var posts = new List<Post>
            {
                new Post
                {
                    Id = 1,
                    Title = "Lộ trình học ASP.NET Core cho người mới",
                    Content = "Nội dung bài viết về lộ trình học .NET...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now
                },
                new Post
                {
                    Id = 2,
                    Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
                    Content = "Nội dung bài viết về sự kết hợp React và API...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now.AddDays(-1)
                },
                new Post
                {
                    Id = 3,
                    Title = "Hướng dẫn cài đặt môi trường Visual Studio",
                    Content = "Các bước cài đặt công cụ cần thiết cho lập trình viên...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now.AddDays(-2)
                }
            };

            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {
            var post = new Post
            {
                Id = id,
                Title = "Nội dung chi tiết bài viết số " + id,
                Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. Ở đây có thể viết dài hơn để thấy sự khác biệt với trang danh sách.",
                ImageUrl = "https://via.placeholder.com/600x300",
                CreatedDate = DateTime.Now
            };

            if (post == null) return NotFound();

            return View(post);
        }
    }
}