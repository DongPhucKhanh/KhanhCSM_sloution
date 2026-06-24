// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Service gọi API sản phẩm từ Backend
import axiosClient from './api';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/products');
    },
    getProductsByCategory: (categoryId) => {
        return axiosClient.get(`/products/categoryproduct/${categoryId}`);
    },
    getProductById: (id) => {
        return axiosClient.get(`/products/${id}`);
    },
    // Tìm kiếm sản phẩm theo từ khóa (Tiêu chí 40)
    searchProducts: (keyword) => {
        return axiosClient.get(`/products/search?q=${encodeURIComponent(keyword)}`);
    },
    // Lấy sản phẩm mới nhất (Tiêu chí 36)
    getNewestProducts: (limit = 3) => {
        return axiosClient.get(`/products/newest?limit=${limit}`);
    },
    // Lấy sản phẩm bán chạy nhất (Tiêu chí 37)
    getBestsellerProducts: (limit = 3) => {
        return axiosClient.get(`/products/bestseller?limit=${limit}`);
    }
};

export default productService;
