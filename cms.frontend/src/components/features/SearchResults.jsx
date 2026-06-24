// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Trang hiển thị kết quả tìm kiếm sản phẩm (Tiêu chí 40)
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

const SearchResults = ({ onSelectProduct, minPrice, maxPrice }) => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!keyword.trim()) {
            setResults([]);
            return;
        }
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await productService.searchProducts(keyword);
                setResults(data || []);
            } catch (err) {
                console.error('Lỗi tìm kiếm:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [keyword]);

    let displayedResults = results;
    if (minPrice !== null && !isNaN(minPrice) && minPrice !== undefined) {
        displayedResults = displayedResults.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice) && maxPrice !== undefined) {
        displayedResults = displayedResults.filter(p => p.price <= maxPrice);
    }

    return (
        <div className="bg-white p-4 shadow-sm border rounded mb-5">
            <h4 className="font-weight-bold text-dark border-bottom border-danger pb-2 mb-4">
                <i className="fa-solid fa-magnifying-glass text-danger mr-2"></i>
                Kết quả tìm kiếm cho: <span className="text-danger">"{ keyword }"</span>
            </h4>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                    <p className="mt-2 text-muted">Đang tìm kiếm...</p>
                </div>
            )}

            {!loading && displayedResults.length === 0 && keyword && (
                <div className="text-center py-5">
                    {/* Ảnh minh họa không tìm thấy (Tiêu chí 43) */}
                    <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🔍</div>
                    <h5 className="text-muted font-weight-bold">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h5>
                    <p className="text-muted small">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc giá.</p>
                </div>
            )}

            {!loading && displayedResults.length > 0 && (
                <>
                    <p className="text-muted small mb-4">Tìm thấy <strong>{displayedResults.length}</strong> sản phẩm</p>
                    <div className="row">
                        {displayedResults.map(item => {
                                const imgUrl = item.imageUrl
                                    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                                    : 'https://via.placeholder.com/300x200?text=No+Image';
                                return (
                                    <div key={item.id} className="col-xl-3 col-md-4 col-sm-6 mb-4">
                                        <div
                                            className="card h-100 border-0 shadow-sm hover-shadow transition-all"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onSelectProduct && onSelectProduct(item.id)}
                                        >
                                            <div className="text-center p-3 border-bottom bg-light" style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={imgUrl} alt={item.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }}
                                                    onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
                                            </div>
                                            <div className="card-body p-3">
                                                <h6 className="font-weight-bold text-dark mb-2" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</h6>
                                                <span className="text-danger font-weight-bold" style={{ fontSize: '1.1rem' }}>
                                                    {item.price?.toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
        </div>
    );
};

export default SearchResults;
