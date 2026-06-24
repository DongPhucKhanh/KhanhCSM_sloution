// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý State toàn cục cho Giỏ Hàng (Context API + LocalStorage)
import React, { createContext, useState, useEffect } from 'react';

// =========================================================================
// KHỞI TẠO CONTEXT
// Tạo ra một cái "Kho lưu trữ chung" (Context) để chứa dữ liệu giỏ hàng.
// Nhờ có cái kho này, mọi Component con (Navbar, Cart, ProductList) đều có thể
// lấy và sửa dữ liệu giỏ hàng trực tiếp mà không cần truyền Props qua nhiều tầng.
// =========================================================================
export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    // =========================================================================
    // 1. KHỞI TẠO STATE GIỎ HÀNG BẰNG LAZY INITIALIZATION
    // Dùng callback function trong useState để chỉ đọc LocalStorage đúng 1 lần 
    // khi trang web vừa load xong, giúp tối ưu hiệu năng (tránh giật lag).
    // =========================================================================
    const [cart, setCart] = useState(() => {
        // Quét tìm xem khách có để quên giỏ hàng cũ từ lần truy cập trước không
        const savedCart = localStorage.getItem('khanhcms_cart');
        // Nếu có: Ép kiểu chuỗi JSON về lại mảng Object. Nếu không: Trả về mảng rỗng.
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // =========================================================================
    // 2. LẮNG NGHE VÀ ĐỒNG BỘ DỮ LIỆU (USE EFFECT)
    // Thiết lập cơ chế: Bất cứ khi nào mảng 'cart' bị thay đổi (thêm, sửa, xóa),
    // đoạn code này sẽ tự động chạy và ghi đè dữ liệu mới nhất xuống ổ cứng trình duyệt.
    // =========================================================================
    useEffect(() => {
        localStorage.setItem('khanhcms_cart', JSON.stringify(cart));
    }, [cart]); // [cart] là mảng phụ thuộc (dependency array)

    // =========================================================================
    // 3. HÀM THÊM SẢN PHẨM VÀO GIỎ HÀNG
    // Nhận vào object sản phẩm và số lượng (mặc định là 1 nếu không truyền)
    // =========================================================================
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const stockQty = product.stockQuantity ?? product.stock ?? 0;
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                return prevCart.map(item => {
                    if (item.id === product.id) {
                        let newQuantity = item.quantity + quantity;
                        if (newQuantity > stockQty) newQuantity = stockQty; // Tiêu chí 42: Chặn vượt tồn kho
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                });
            }

            let initQuantity = quantity;
            if (initQuantity > stockQty) initQuantity = stockQty; // Tiêu chí 42: Chặn vượt tồn kho
            return [...prevCart, { ...product, quantity: initQuantity }];
        });
    };

    // =========================================================================
    // 4. HÀM XÓA 1 MÓN KHỎI GIỎ HÀNG
    // Dùng hàm filter() để lọc ra những món "CÓ ID KHÁC VỚI ID CẦN XÓA",
    // vô tình tạo ra một mảng mới không còn chứa món bị xóa.
    // =========================================================================
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // =========================================================================
    // 5. HÀM CẬP NHẬT TĂNG/GIẢM SỐ LƯỢNG MÓN HÀNG
    // =========================================================================
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId) {
                const stockQty = item.stockQuantity ?? item.stock ?? 0;
                if (newQuantity > stockQty) newQuantity = stockQty; // Tiêu chí 42
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    // =========================================================================
    // 6. HÀM XÓA TRẮNG GIỎ HÀNG (CẬP NHẬT BẢO MẬT TUYỆT ĐỐI)
    // Dùng trong 2 trường hợp: (1) Khách đã thanh toán xong, (2) Khách Đăng xuất
    // =========================================================================
    const clearCart = () => {
        setCart([]); // Xóa sạch dữ liệu trên giao diện React (đưa mảng về rỗng)
        localStorage.removeItem('khanhcms_cart'); // Ép xóa sạch gốc rễ dưới LocalStorage ngay lập tức
    };

    // =========================================================================
    // 7. TỰ ĐỘNG TÍNH TOÁN (COMPUTED VALUES)
    // Sử dụng hàm reduce() mạnh mẽ của Javascript để quét qua mảng và tính tổng
    // =========================================================================
    // Tính tổng tiền = Tổng của (Giá từng món x Số lượng tương ứng)
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Tính tổng số lượng = Tổng tất cả các item.quantity
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    // =========================================================================
    // KẾT XUẤT PROVIDER BAO BỌC
    // Bơm tất cả mảng dữ liệu và các hàm công cụ vào "value" để các thẻ con lấy ra xài
    // =========================================================================
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};