using System;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } // Tên đăng nhập
        public string FullName { get; set; } // Họ và tên người dùng
        public string Email { get; set; } // Địa chỉ Email
        public string Role { get; set; } // Vai trò (Administrator, Editor, Viewer)
        public bool IsActive { get; set; } // Trạng thái hoạt động
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}