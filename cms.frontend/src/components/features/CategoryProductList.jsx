// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Hiển thị danh mục sản phẩm dạng khối ảnh tròn/vuông kích thích click (Tiêu chí 38)
import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

// Màu nền gradient dự phòng cho từng danh mục khi chưa có ảnh
const FALLBACK_COLORS = [
    'linear-gradient(135deg, #b30000, #ff6b6b)',
    'linear-gradient(135deg, #1a202c, #4a5568)',
    'linear-gradient(135deg, #2d3748, #b30000)',
    'linear-gradient(135deg, #c53030, #feb2b2)',
    'linear-gradient(135deg, #1c1c2e, #c53030)',
    'linear-gradient(135deg, #742a2a, #fc8181)',
];

// Icon đại diện cho từng danh mục (theo thứ tự)
const FALLBACK_ICONS = ['🔧', '🚗', '⚙️', '🛞', '🔩', '💡', '🔑', '🏎️'];

const CategoryProductList = ({ selectedCategoryId, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data || []);
            } catch (err) {
                console.error('Lỗi tải danh mục:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-danger" role="status"></div>
            </div>
        );
    }

    return (
        <div>
            {/* NÚT XEM TẤT CẢ */}
            <div
                className={`d-flex align-items-center px-3 py-2 cursor-pointer ${
                    selectedCategoryId === null ? 'bg-danger text-white' : 'text-dark hover-bg-light'
                }`}
                style={{ cursor: 'pointer', transition: 'all 0.2s', borderLeft: selectedCategoryId === null ? '4px solid #fff' : '4px solid transparent' }}
                onClick={() => onSelectCategory(null)}
            >
                <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>🏪</span>
                <span className="font-weight-bold small text-uppercase">Tất cả sản phẩm</span>
            </div>

            {/* DANH SÁCH DANH MỤC DẠNG KHỐI */}
            <div className="p-2">
                {categories.map((cat, index) => {
                    const isSelected = selectedCategoryId === cat.id;
                    const imgUrl = cat.imageUrl
                        ? (cat.imageUrl.startsWith('http') ? cat.imageUrl : `${IMAGE_BASE_URL}${cat.imageUrl}`)
                        : null;
                    const fallbackColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                    const fallbackIcon = FALLBACK_ICONS[index % FALLBACK_ICONS.length];

                    return (
                        <div
                            key={cat.id}
                            className={`d-flex align-items-center mb-2 rounded p-2 ${
                                isSelected ? 'bg-danger text-white' : 'bg-light text-dark'
                            }`}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: isSelected ? '2px solid #b30000' : '2px solid transparent',
                                boxShadow: isSelected ? '0 2px 8px rgba(179,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => onSelectCategory(cat.id)}
                        >
                            {/* Ảnh/Icon đại diện danh mục dạng khối tròn */}
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    background: imgUrl ? 'transparent' : fallbackColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '10px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}
                            >
                                {imgUrl ? (
                                    <img
                                        src={imgUrl}
                                        alt={cat.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '1.4rem' }}>{fallbackIcon}</span>
                                )}
                            </div>

                            {/* Tên danh mục */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    className="font-weight-bold small text-uppercase"
                                    style={{
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        color: isSelected ? 'white' : '#1a202c'
                                    }}
                                >
                                    {cat.name}
                                </div>
                                {cat.description && (
                                    <div className="" style={{ fontSize: '0.7rem', opacity: 0.7, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {cat.description}
                                    </div>
                                )}
                            </div>

                            {/* Mũi tên chỉ hướng */}
                            {isSelected && <i className="fa-solid fa-chevron-right ml-auto" style={{ color: 'white', fontSize: '0.8rem' }}></i>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryProductList;
