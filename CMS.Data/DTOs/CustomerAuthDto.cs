using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.DTOs
{
    public class CustomerRegisterDto
    {
        [Required(ErrorMessage = "Vui lòng nhập họ và tên")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    public class CustomerLoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}