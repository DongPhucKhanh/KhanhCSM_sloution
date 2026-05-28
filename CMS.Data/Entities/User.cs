// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Thực thể Người dùng (User) - Đồng bộ cấu trúc mật khẩu thô trực tiếp
using System;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập phải từ 3 đến 50 ký tự")]
        public string Username { get; set; } // Tên đăng nhập

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Mật khẩu phải từ 3 ký tự trở lên")]
        public string Password { get; set; } // Sử dụng mật khẩu thô trực tiếp theo yêu cầu

        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; } // Họ và tên người dùng

        [Required(ErrorMessage = "Địa chỉ Email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ Email không đúng định dạng")]
        public string Email { get; set; } // Địa chỉ Email

        [Required(ErrorMessage = "Vui lòng chọn vai trò quyền hạn")]
        public string Role { get; set; } // Vai trò (Admin hoặc Editor)

        public bool IsActive { get; set; } // Trạng thái hoạt động

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}