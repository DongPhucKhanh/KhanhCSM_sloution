// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị danh sách bài viết (Có hỗ trợ lọc theo danh mục và giới hạn số lượng)
import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

// Định nghĩa đường dẫn gốc của Backend để nối vào tên file ảnh
const IMAGE_BASE_URL = 'https://localhost:7004';

// Component nhận vào 3 tham số (props) từ Component cha (App.js):
// - selectedBlogCategoryId: Mã danh mục đang được chọn (null = lấy tất cả)
// - onSelectPost: Hàm kích hoạt khi bấm vào 1 bài viết để xem chi tiết
// - limit: Số lượng bài viết tối đa muốn hiển thị (dùng cho ngoài trang chủ)
const PostList = ({ selectedBlogCategoryId, onSelectPost, limit }) => {

    // 1. KHỞI TẠO STATE QUẢN LÝ DỮ LIỆU
    // posts: Mảng chứa danh sách bài viết lấy từ CSDL. Mặc định là mảng rỗng [].
    const [posts, setPosts] = useState([]);
    // loading: Trạng thái chờ tải dữ liệu. Mặc định là true (đang tải) để hiện vòng xoay.
    const [loading, setLoading] = useState(true);

    // 2. LẮNG NGHE SỰ KIỆN VÀ GỌI API (Side Effects)
    // useEffect sẽ tự động chạy lại toàn bộ khối lệnh bên trong mỗi khi biến [selectedBlogCategoryId] bị thay đổi giá trị.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true); // Bật hiệu ứng loading trước khi gọi API
                let data = [];

                // KIỂM TRA ĐIỀU KIỆN ĐỂ GỌI API TƯƠNG ỨNG
                if (selectedBlogCategoryId === null) {
                    // Nếu id danh mục là null -> Khách đang ở chế độ xem "Tất cả bài viết"
                    data = await blogService.getAllPosts();
                } else {
                    // Nếu id có số cụ thể -> Khách đang lọc, gọi API lấy bài theo chuyên mục đó
                    data = await blogService.getPostsByCategory(selectedBlogCategoryId);
                }

                setPosts(data); // Cập nhật mảng dữ liệu lấy được vào state 'posts'

                // XỬ LÝ TRẢI NGHIỆM NGƯỜI DÙNG (UX): TỰ ĐỘNG CUỘN TRANG
                // Khi khách bấm lọc, tự động trượt trình duyệt lên khu vực có id="blog"
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    blogSection.scrollIntoView({
                        behavior: 'smooth', // Hiệu ứng trượt êm ái
                        block: 'start'      // Căn mép trên của phần tử lên sát trần trình duyệt
                    });
                }

            } catch (error) {
                // Bắt lỗi nếu Backend bị sập hoặc mất kết nối mạng
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                // Dù thành công hay thất bại cũng phải tắt hiệu ứng loading
                setLoading(false);
            }
        };

        fetchPosts(); // Thực thi hàm vừa định nghĩa ở trên
    }, [selectedBlogCategoryId]);

    // 3. KIỂM TRA TRẠNG THÁI LOADING (HIỂN THỊ CHỜ)
    // Nếu dữ liệu chưa về kịp, lập tức ngắt render và trả ra giao diện chờ.
    if (loading) {
        return <div className="text-center my-4 text-muted small"><i className="fas fa-spinner fa-spin mr-2"></i>Đang tải tin tức bài viết...</div>;
    }

    // 4. RENDER GIAO DIỆN CHÍNH
    return (
        <div className="row">
            {/* Nếu mảng posts trống (không có dữ liệu) -> Hiện thông báo rỗng */}
            {posts.length === 0 ? (
                <div className="col-12 text-center text-muted small py-4 border rounded bg-light">
                    <i className="fa-solid fa-folder-open mb-2 fa-2xl opacity-50"></i>
                    <p className="m-0">Chủ đề này hiện chưa có bài viết nào.</p>
                </div>
            ) : (
                /* NẾU CÓ DỮ LIỆU: Dùng hàm .map() để duyệt qua từng phần tử trong mảng và tạo ra các khối HTML tương ứng */
                /* ĐÃ CẬP NHẬT LOGIC LIMIT: Nếu prop 'limit' có tồn tại, dùng .slice(0, limit) để cắt mảng lấy đúng số lượng cần thiết (VD: 3 bài). Ngược lại thì lấy toàn bộ mảng. */
                (limit ? posts.slice(0, limit) : posts).map((item) => {

                    // XỬ LÝ ẢNH HIỂN THỊ: 
                    // Kiểm tra xem trường imageUrl có tồn tại không. 
                    // Nếu là link ngoài (bắt đầu bằng http) thì giữ nguyên, nếu là link cục bộ (/uploads/...) thì ghép với IMAGE_BASE_URL.
                    // Nếu mất ảnh trong CSDL thì dùng ảnh giả (Placeholder).
                    const postImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/150?text=News';

                    return (
                        // Bắt buộc phải có thuộc tính key={item.id} để ReactJS quản lý danh sách và tối ưu hiệu suất render
                        <div className="col-12 mb-3" key={item.id}>
                            <div className="card border-0 shadow-sm p-3 rounded">
                                <div className="row align-items-center">

                                    {/* CỘT 1: HÌNH ẢNH */}
                                    <div className="col-md-2 col-3">
                                        <img
                                            src={postImgUrl}
                                            alt={item.title}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ height: '70px', width: '100%', objectFit: 'cover' }}
                                            // Sự kiện dự phòng (Fallback): Lỡ hình lỗi tải không được trên web, tự thay bằng hình chữ Error
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                        />
                                    </div>

                                    {/* CỘT 2: THÔNG TIN TIÊU ĐỀ & MÔ TẢ */}
                                    <div className="col-md-9 col-7">
                                        {/* BẮT SỰ KIỆN CLICK (onClick): Truyền mã bài viết (item.id) ngược lên cho Component cha để mở trang chi tiết */}
                                        <h6
                                            className="font-weight-bold mb-1 text-dark text-truncate cursor-pointer text-hover-danger"
                                            title={item.title}
                                            onClick={() => onSelectPost(item.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.title}
                                        </h6>
                                        <p className="text-muted small mb-2 text-truncate-2" style={{ lineHeight: '1.4' }}>
                                            {item.shortDescription || item.content || "Nhấn để xem chi tiết nội dung bài viết chia sẻ về cẩm nang kỹ thuật..."}
                                        </p>

                                        {/* HIỂN THỊ THÔNG TIN PHỤ (Tag danh mục, ngày tháng) */}
                                        <div className="d-flex align-items-center text-muted small" style={{ fontSize: '0.8rem' }}>
                                            <span className="badge badge-danger text-white mr-3 px-2 py-1">{item.categoryName || "Tin tức"}</span>
                                            <span>
                                                <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                                {/* Định dạng ngày tháng về kiểu Việt Nam (dd/mm/yyyy) */}
                                                {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "Vừa xong"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CỘT 3: NÚT MŨI TÊN CHUYỂN TRANG */}
                                    <div className="col-md-1 col-2 text-right">
                                        <button
                                            className="btn btn-light btn-sm rounded-circle shadow-sm border text-danger"
                                            style={{ width: '32px', height: '32px', padding: 0 }}
                                            onClick={() => onSelectPost(item.id)}
                                        >
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
    );
};

export default PostList;