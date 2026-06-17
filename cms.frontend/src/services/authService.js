// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import axiosClient from '../api/axiosClient';

const authService = {
    // 🔥 BỔ SUNG: Truyền thêm phone, address vào tham số và payload gửi đi
    register: (fullName, email, password, phone, address) => {
        return axiosClient.post('/CustomerAuth/register', {
            fullName,
            email,
            password,
            phone,
            address
        });
    },
    login: (email, password) => {
        return axiosClient.post('/CustomerAuth/login', { email, password });
    }
};

export default authService;