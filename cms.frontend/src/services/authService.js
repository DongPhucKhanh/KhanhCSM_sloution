// H? và tên: Ð?ng Phúc Khánh - MSSV: 2123110051
import axiosClient from './api';

const authService = {
    // ?? B? SUNG: Truy?n thêm phone, address vào tham s? và payload g?i ði
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
