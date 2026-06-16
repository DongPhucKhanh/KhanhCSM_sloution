// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = ({ selectedBlogCategoryId, onSelectBlogCategory }) => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogCategories();
    }, []);

    if (loading) {
        return <div className="text-center my-3 text-muted small"><i className="fas fa-spinner fa-spin mr-2"></i>Đang nạp chủ đề...</div>;
    }

    return (
        <div className="modern-card">
            <div className="list-group list-group-flush">
                {/* Nút xem Tất cả bài viết */}
                <button
                    type="button"
                    onClick={() => onSelectBlogCategory(null)}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedBlogCategoryId === null ? 'active' : ''}`}
                >
                    <span><i className="fa-solid fa-list-check mr-2 text-muted"></i>Tất cả bài viết</span>
                    <span className="badge badge-light border text-muted px-2 py-1" style={{ fontSize: '0.7rem' }}>All</span>
                </button>

                {blogCategories.length === 0 ? (
                    <div className="py-2 text-center text-muted small">Chưa có chủ đề nào.</div>
                ) : (
                    blogCategories.map((cate) => (
                        <button
                            key={cate.id}
                            type="button"
                            onClick={() => onSelectBlogCategory(cate.id)}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedBlogCategoryId === cate.id ? 'active' : ''}`}
                        >
                            <span><i className="fa-solid fa-hashtag mr-2 text-muted"></i>{cate.name}</span>
                            <span className="badge badge-light border text-muted px-2 py-1" style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>Read</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogCategoryList;