// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Quản lý State toàn cục cho Giỏ Hàng (Context API + LocalStorage)
import React, { createContext, useState, useEffect } from 'react';

// Tạo Context để các Component con có thể truy cập dữ liệu giỏ hàng mà không cần truyền Prop lằng nhằng
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Khởi tạo State giỏ hàng: Quét xem trong máy tính khách đã có giỏ hàng cũ chưa, có thì móc ra, không thì mảng rỗng
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('khanhcms_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Lắng nghe thay đổi: Cứ mỗi khi mảng 'cart' bị thay đổi (thêm/xóa món), tự động lưu đè vào LocalStorage
    useEffect(() => {
        localStorage.setItem('khanhcms_cart', JSON.stringify(cart));
    }, [cart]);

    // 3. Hàm Thêm vào giỏ hàng
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            // Kiểm tra món này đã có trong giỏ chưa
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Có rồi thì cộng dồn số lượng
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            // Chưa có thì thêm mới vào mảng
            return [...prevCart, { ...product, quantity }];
        });
    };

    // 4. Hàm Xóa 1 món khỏi giỏ
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // 5. Hàm Cập nhật số lượng (+ / -)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId); // Giảm về 0 thì tự xóa luôn
            return;
        }
        setCart(prevCart => prevCart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    // 6. Xóa trắng giỏ hàng (Dùng sau khi thanh toán xong)
    const clearCart = () => setCart([]);

    // 7. Tự động tính toán Tổng tiền và Tổng số lượng món
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};