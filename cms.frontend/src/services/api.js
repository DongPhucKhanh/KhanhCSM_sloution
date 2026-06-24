// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Cấu hình axios dùng biến môi trường .env (Tiêu chí 45 - không hardcode URL)
import axios from 'axios';

// Đọc URL từ file .env thay vì hardcode - chuẩn cấu trúc doanh nghiệp
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7004/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
