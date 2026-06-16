// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị danh mục và xử lý sự kiện click chọn danh mục
import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ selectedCategoryId, onSelectCategory }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-3 text-muted small"><i className="fas fa-spinner fa-spin mr-2"></i>Đang tải danh mục...</div>;
    }

    return (
        <div className="modern-card p-3 mb-4">
            <h6 className="text-uppercase font-weight-bold text-dark border-bottom pb-2 mb-2 d-flex align-items-center" style={{ fontSize: '0.88rem', letterSpacing: '0.5px' }}>
                <i className="fa-solid fa-cubes text-primary mr-2"></i> Danh mục SP
            </h6>
            <div className="list-group list-group-flush">
                {/* NÚT TẤT CẢ SẢN PHẨM: Khi click sẽ truyền giá trị null */}
                <button
                    type="button"
                    className={`list-group-item list-group-item-action modern-list-item d-flex justify-content-between align-items-center ${selectedCategoryId === null ? 'active bg-warning text-dark font-weight-bold rounded' : ''}`}
                    onClick={() => onSelectCategory(null)}
                >
                    <span><i className="fa-solid fa-border-all mr-2 small"></i>Tất cả phụ tùng</span>
                </button>

                {categoryProducts.length === 0 ? (
                    <div className="py-2 text-center text-muted small">Không có dữ liệu.</div>
                ) : (
                    categoryProducts.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`list-group-item list-group-item-action modern-list-item d-flex justify-content-between align-items-center ${selectedCategoryId === item.id ? 'active bg-primary text-white font-weight-bold rounded' : ''}`}
                            onClick={() => onSelectCategory(item.id)} // Kích hoạt sự kiện đổi mã danh mục khi bấm
                        >
                            <span className="font-weight-normal">{item.name}</span>
                            <i className="fa-solid fa-chevron-right small" style={{ opacity: 0.5, fontSize: '0.75rem' }}></i>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryProductList;