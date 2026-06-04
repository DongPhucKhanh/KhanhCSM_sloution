// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị bài viết kèm hình ảnh minh họa Thumbnail nằm bên trái
import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

// ĐỊNH NGHĨA CỔNG PORT BACKEND THỰC TẾ ĐỂ TRUY XUẤT wwwroot/uploads
const IMAGE_BASE_URL = 'https://localhost:7004';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4 text-muted small">Đang tải tin tức bài viết...</div>;
    }

    return (
        <div className="mt-4 pt-2">
            <h5 className="section-title text-uppercase mb-4">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h5>

            <div className="row">
                {posts.length === 0 ? (
                    <div className="col-12 text-muted small py-2">Chưa có bài viết tin tức nào.</div>
                ) : (
                    posts.map((item) => {
                        // Kiểm tra và xử lý ghép chuỗi đường dẫn hình ảnh cho bài viết blog
                        const postImgUrl = item.imageUrl
                            ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                            : 'https://via.placeholder.com/150?text=News';

                        return (
                            <div className="col-12 mb-3" key={item.id}>
                                <div className="card modern-card border-0 p-3">
                                    <div className="row align-items-center">

                                      
                                        <div className="col-md-2 col-3">
                                            <img
                                                src={postImgUrl}
                                                alt={item.title}
                                                className="img-fluid rounded shadow-sm"
                                                style={{ height: '70px', width: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                            />
                                        </div>

                                        {/* Khối cột phải hiển thị Tiêu đề và Mô tả */}
                                        <div className="col-md-9 col-7">
                                            <h6 className="font-weight-bold mb-1 text-dark text-truncate" title={item.title}>
                                                {item.title}
                                            </h6>
                                            <p className="text-muted small mb-2 text-truncate-2" style={{ lineHeight: '1.4' }}>
                                                {item.shortDescription || "Nhấn để xem chi tiết bài viết chia sẻ về cẩm nang kỹ thuật và xu hướng phối đồ mới nhất..."}
                                            </p>
                                            <div className="d-flex align-items-center text-muted small" style={{ fontSize: '0.8rem' }}>
                                                <span className="badge badge-light border mr-3 text-secondary px-2 py-1">{item.categoryName || "Tin tức"}</span>
                                                <span>
                                                    <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "Vừa xong"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Nút mũi tên xem nhanh */}
                                        <div className="col-md-1 col-2 text-right">
                                            <button className="btn btn-light btn-sm rounded-circle shadow-sm border text-info" style={{ width: '32px', height: '32px', padding: 0 }}>
                                                <i className="fa-solid fa-angle-right"></i>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PostList;