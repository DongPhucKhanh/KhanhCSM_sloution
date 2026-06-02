// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component kết nối API hiển thị danh sách bài viết thời trang mẫu dòng thời gian
import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

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
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4 text-muted">Đang tải tin tức thời trang...</div>;
    }

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            <div className="row">
                {posts.length === 0 ? (
                    <div className="col-12">
                        <p className="text-muted">Chưa có bài viết tin tức nào được đăng tải.</p>
                    </div>
                ) : (
                    posts.map((item) => (
                        <div className="col-12 mb-3" key={item.id}>
                            <div className="card border-0 bg-light shadow-sm p-3 rounded transition-all">
                                <div className="row align-items-center">
                                    {/* Ảnh đại diện bài viết bài viết */}
                                    <div className="col-md-2 col-3">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/150?text=News"}
                                            alt={item.title}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ height: '75px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    {/* Nội dung tóm tắt */}
                                    <div className="col-md-10 col-9">
                                        <h6 className="font-weight-bold mb-1 text-dark text-truncate" title={item.title}>
                                            {item.title}
                                        </h6>
                                        <p className="text-muted small mb-0 d-flex align-items-center gap-3">
                                            <span className="badge badge-info mr-2">{item.categoryName || "Tin tức"}</span>
                                            <span>
                                                <i className="fa-regular fa-calendar-days mr-1"></i>
                                                {/* Định dạng DateTime thô từ SQL thành ngày Việt Nam thân thiện */}
                                                {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "Vừa xong"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PostList;