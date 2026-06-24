// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlogCategoryList from '../../components/features/BlogCategoryList';
import PostList from '../../components/features/PostList';

const BlogPage = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const currentCatId = categoryId ? parseInt(categoryId) : null;

    return (
        <div className="container-fluid px-xl-5 mt-4">
            <div className="row">
                <div className="col-xl-3 col-lg-4 mb-4">
                    <div className="sticky-sidebar" style={{ position: 'sticky', top: '20px' }}>
                        <div className="classic-sidebar bg-white shadow-sm border border-top-0">
                            <div className="sidebar-header text-white p-3 font-weight-bold text-uppercase d-flex align-items-center" style={{ backgroundColor: '#1a202c' }}>
                                <i className="fa-solid fa-folder-open mr-3 fa-lg"></i> CHỦ ĐỀ BÀI VIẾT
                            </div>
                            <div className="sidebar-content">
                                <BlogCategoryList
                                    selectedCategoryId={currentCatId}
                                    onSelectCategory={(id) => {
                                        if (id === null) navigate('/blog');
                                        else navigate(`/blog/category/${id}`);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9 col-lg-8">
                    <div className="posts-wrapper bg-white p-4 shadow-sm border mb-4">
                        <h4 className="text-danger font-weight-bold border-bottom border-danger pb-2 mb-4 text-uppercase">TIN TỨC CẬP NHẬT</h4>
                        <PostList
                            selectedBlogCategoryId={currentCatId}
                            onSelectPost={(id) => navigate(`/blog/${id}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
