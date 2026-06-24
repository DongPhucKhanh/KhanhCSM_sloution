// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Giao diện hiển thị Chi tiết một bài viết tin tức
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

const PostDetailPage = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(postId);
                setPost(data);

                // Cuộn mượt mà lên đầu bài viết
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        if (postId) fetchPostDetail();
    }, [postId]);

    if (loading) {
        return <div className="text-center my-5 text-muted"><i className="fas fa-spinner fa-spin fa-2xl mr-2"></i>Đang tải dữ liệu bài viết...</div>;
    }

    if (!post) {
        return <div className="text-center text-danger my-4">Không tìm thấy nội dung bài viết!</div>;
    }

    const postImgUrl = post.imageUrl
        ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${IMAGE_BASE_URL}${post.imageUrl}`)
        : 'https://via.placeholder.com/800x400?text=No+Cover+Image';

    return (
        <div className="post-detail-wrapper bg-white p-3">
            {/* Nút quay lại */}
            <button onClick={() => navigate(-1)} className="btn btn-outline-danger btn-sm mb-4 rounded-pill px-3 font-weight-bold">
                <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại danh sách
            </button>

            {/* Tiêu đề và Meta Data */}
            <h2 className="text-dark font-weight-bold mb-3" style={{ lineHeight: '1.4' }}>{post.title}</h2>
            <div className="d-flex align-items-center text-muted small mb-4 border-bottom pb-3">
                <span className="badge badge-danger text-white px-2 py-1 mr-3">TIN TỨC CHUYÊN NGÀNH</span>
                <span className="mr-3"><i className="fa-regular fa-calendar-days mr-1"></i> {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : "Vừa xong"}</span>
                <span><i className="fa-solid fa-user-pen mr-1"></i> Đăng bởi: Admin KHANHCMS</span>
            </div>

            {/* Ảnh Cover bài viết */}
            <div className="mb-4 text-center overflow-hidden rounded shadow-sm border">
                <img src={postImgUrl} alt={post.title} className="img-fluid w-100" style={{ maxHeight: '450px', objectFit: 'cover' }} />
            </div>

            {/* Nội dung bài viết (Render HTML an toàn từ CSDL) */}
            <div
                className="post-content text-dark"
                style={{ fontSize: '1.05rem', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-top border-danger mt-5 pt-3 text-center">
                <p className="font-weight-bold text-danger text-uppercase mb-0">CHIA SẺ CẨM NANG NÀY</p>
                <div className="mt-2">
                    <button className="btn btn-primary btn-sm mx-1"><i className="fa-brands fa-facebook-f"></i></button>
                    <button className="btn btn-info btn-sm mx-1"><i className="fa-brands fa-twitter"></i></button>
                    <button className="btn btn-danger btn-sm mx-1"><i className="fa-brands fa-pinterest"></i></button>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
