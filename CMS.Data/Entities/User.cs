//Họ và tên: Đồng Phúc Khánh 
//    MSSV: 2123110051
//    version: 1.0
using System;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } // Tên đăng nhập
        public string FullName { get; set; } // Họ và tên người dùng
        public string Email { get; set; } // Địa chỉ Email
        public string Password { get; set; } // Mật khẩu đăng nhập
        public string Role { get; set; } // Vai trò (Administrator, Editor, Viewer)
        public bool IsActive { get; set; } // Trạng thái hoạt động
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}