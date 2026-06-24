// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CategoryProductList from '../../components/features/CategoryProductList';
import ProductList from '../../components/features/ProductList';

const ShopPage = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const currentCatId = categoryId ? parseInt(categoryId) : null;
    const [searchParams, setSearchParams] = useSearchParams();
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');
    const [inputMin, setInputMin] = useState(urlMinPrice || '');
    const [inputMax, setInputMax] = useState(urlMaxPrice || '');

    useEffect(() => {
        setInputMin(urlMinPrice || '');
        setInputMax(urlMaxPrice || '');
    }, [urlMinPrice, urlMaxPrice]);

    const handleApplyPrice = (e) => {
        e.preventDefault();
        if (inputMin) searchParams.set('minPrice', inputMin); else searchParams.delete('minPrice');
        if (inputMax) searchParams.set('maxPrice', inputMax); else searchParams.delete('maxPrice');
        setSearchParams(searchParams);
    };

    const handleClearPrice = () => {
        setInputMin(''); setInputMax('');
        searchParams.delete('minPrice'); searchParams.delete('maxPrice');
        setSearchParams(searchParams);
    };

    return (
        <div className="container-fluid px-xl-5 mt-4">
            <div className="row">
                <div className="col-xl-3 col-lg-4 mb-4">
                    <div className="sticky-sidebar custom-scrollbar" style={{ position: 'sticky', top: '20px', zIndex: 100, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                        <div className="classic-sidebar bg-white mb-4 shadow-sm border border-top-0">
                            <div className="sidebar-header text-white p-3 font-weight-bold text-uppercase d-flex align-items-center" style={{ backgroundColor: '#1a202c' }}>
                                <i className="fa-solid fa-bars mr-3 fa-lg"></i> DANH MỤC SẢN PHẨM
                            </div>
                            <div className="sidebar-content">
                                <CategoryProductList
                                    selectedCategoryId={currentCatId}
                                    onSelectCategory={(id) => {
                                        let extraQuery = '';
                                        if (urlMinPrice) extraQuery += `&minPrice=${urlMinPrice}`;
                                        if (urlMaxPrice) extraQuery += `&maxPrice=${urlMaxPrice}`;
                                        const queryStr = extraQuery ? '?' + extraQuery.substring(1) : '';
                                        if (id === null) navigate(`/products${queryStr}`);
                                        else navigate(`/products/category/${id}${queryStr}`);
                                    }}
                                />
                            </div>
                        </div>

                        {/* LỌC GIÁ */}
                        <div className="classic-sidebar bg-white mb-4 shadow-sm border border-top-0">
                            <div className="sidebar-header text-white p-3 font-weight-bold text-uppercase d-flex align-items-center" style={{ backgroundColor: '#b30000' }}>
                                <i className="fa-solid fa-money-bill-wave mr-3 fa-lg"></i> KHOẢNG GIÁ (đ)
                            </div>
                            <div className="sidebar-content p-3">
                                <div className="custom-control custom-radio mb-3">
                                    <input type="radio" id="price-all" name="priceFilter" className="custom-control-input"
                                        checked={!urlMinPrice && !urlMaxPrice}
                                        onChange={handleClearPrice} />
                                    <label className="custom-control-label cursor-pointer text-dark font-weight-bold" htmlFor="price-all">Tất cả mức giá</label>
                                </div>

                                <div className="custom-control custom-radio mb-3">
                                    <input type="radio" id="price-1" name="priceFilter" className="custom-control-input"
                                        checked={urlMaxPrice === '1000000' && !urlMinPrice}
                                        onChange={() => {
                                            searchParams.delete('minPrice');
                                            searchParams.set('maxPrice', '1000000');
                                            setSearchParams(searchParams);
                                        }} />
                                    <label className="custom-control-label cursor-pointer text-dark" htmlFor="price-1">Dưới 1.000.000 đ</label>
                                </div>

                                <div className="custom-control custom-radio mb-3">
                                    <input type="radio" id="price-2" name="priceFilter" className="custom-control-input"
                                        checked={urlMinPrice === '1000000' && urlMaxPrice === '3000000'}
                                        onChange={() => {
                                            searchParams.set('minPrice', '1000000');
                                            searchParams.set('maxPrice', '3000000');
                                            setSearchParams(searchParams);
                                        }} />
                                    <label className="custom-control-label cursor-pointer text-dark" htmlFor="price-2">Từ 1.000.000 đ - 3.000.000 đ</label>
                                </div>

                                <div className="custom-control custom-radio mb-4">
                                    <input type="radio" id="price-3" name="priceFilter" className="custom-control-input"
                                        checked={urlMinPrice === '3000000' && !urlMaxPrice}
                                        onChange={() => {
                                            searchParams.set('minPrice', '3000000');
                                            searchParams.delete('maxPrice');
                                            setSearchParams(searchParams);
                                        }} />
                                    <label className="custom-control-label cursor-pointer text-dark" htmlFor="price-3">Trên 3.000.000 đ</label>
                                </div>

                                <hr className="mb-3 border-secondary" style={{ opacity: '0.2' }} />

                                <form onSubmit={handleApplyPrice}>
                                    <p className="small text-muted font-weight-bold mb-2">HOẶC NHẬP TỰ DO:</p>
                                    <div className="d-flex align-items-center mb-3">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center border-secondary"
                                            placeholder="TỪ"
                                            value={inputMin}
                                            onChange={(e) => setInputMin(e.target.value)}
                                            min="0"
                                        />
                                        <span className="mx-2 text-muted font-weight-bold">-</span>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center border-secondary"
                                            placeholder="ĐẾN"
                                            value={inputMax}
                                            onChange={(e) => setInputMax(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-6 pr-1">
                                            <button type="submit" className="btn btn-danger btn-block btn-sm font-weight-bold text-uppercase shadow-sm">
                                                Áp dụng
                                            </button>
                                        </div>
                                        <div className="col-6 pl-1">
                                            <button type="button" onClick={handleClearPrice} className="btn btn-light border btn-block btn-sm font-weight-bold text-uppercase text-muted shadow-sm">
                                                Xóa lọc
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9 col-lg-8">
                    <div className="products-wrapper bg-white p-4 shadow-sm border mb-4">
                        <h4 className="text-danger font-weight-bold border-bottom border-danger pb-2 mb-4 text-uppercase">KHO PHỤ TÙNG CHÍNH HÃNG</h4>
                        <ProductList
                            selectedCategoryId={currentCatId}
                            minPrice={urlMinPrice ? parseInt(urlMinPrice) : null}
                            maxPrice={urlMaxPrice ? parseInt(urlMaxPrice) : null}
                            onSelectProduct={(id) => navigate(`/product/${id}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
