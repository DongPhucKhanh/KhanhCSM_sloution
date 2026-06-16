import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách quần áo, váy dạ hội
    getAllProducts: () => {
        const url = '/Products'; // Phải khớp chính xác với Router trong ProductsController phía Backend
        return axiosClient.get(url);
    },
    // 2. BỔ SUNG: Hàm gọi API lọc sản phẩm theo ID Danh mục
    getProductsByCategory: (categoryId) => {
        const url = `/Products/categoryproduct/${categoryId}`; // Khớp chính xác Route Backend [HttpGet("categoryproduct/{categoryProductId}")]
        return axiosClient.get(url);
    },
    getProductById: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    }
};

export default productService;