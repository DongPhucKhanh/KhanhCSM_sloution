// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Trục gọi API Bài viết và bổ sung Chuyên mục tin tức (Mở rộng Buổi 8)
import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết (Đã làm ở phần thực hành chung)
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },
    // 2. BÀI TẬP TỰ LÀM: Thêm hàm lấy danh sách Chuyên mục tin tức (Category)
    getBlogCategories: () => {
        const url = '/Categories'; // Cần khớp chính xác với [Route("api/Categories")] trong CategoriesController ở Backend
        return axiosClient.get(url);
    }
};

export default blogService;