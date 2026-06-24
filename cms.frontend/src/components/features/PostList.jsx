// H? và tên: Ð?ng Phúc Khánh - MSSV: 2123110051
// Ch?c nãng: Component hi?n th? danh sách bài vi?t (Có h? tr? l?c theo danh m?c và gi?i h?n s? lý?ng)
import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';

// Ð?nh ngh?a ðý?ng d?n g?c c?a Backend ð? n?i vào tên file ?nh
const IMAGE_BASE_URL = 'https://localhost:7004';

// Component nh?n vào 3 tham s? (props) t? Component cha (App.js):
// - selectedBlogCategoryId: M? danh m?c ðang ðý?c ch?n (null = l?y t?t c?)
// - onSelectPost: Hàm kích ho?t khi b?m vào 1 bài vi?t ð? xem chi ti?t
// - limit: S? lý?ng bài vi?t t?i ða mu?n hi?n th? (dùng cho ngoài trang ch?)
const PostList = ({ selectedBlogCategoryId, onSelectPost, limit }) => {

    // 1. KH?I T?O STATE QU?N L? D? LI?U
    // posts: M?ng ch?a danh sách bài vi?t l?y t? CSDL. M?c ð?nh là m?ng r?ng [].
    const [posts, setPosts] = useState([]);
    // loading: Tr?ng thái ch? t?i d? li?u. M?c ð?nh là true (ðang t?i) ð? hi?n v?ng xoay.
    const [loading, setLoading] = useState(true);

    // 2. L?NG NGHE S? KI?N VÀ G?I API (Side Effects)
    // useEffect s? t? ð?ng ch?y l?i toàn b? kh?i l?nh bên trong m?i khi bi?n [selectedBlogCategoryId] b? thay ð?i giá tr?.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true); // B?t hi?u ?ng loading trý?c khi g?i API
                let data = [];

                // KI?M TRA ÐI?U KI?N Ð? G?I API TÝÕNG ?NG
                if (selectedBlogCategoryId === null) {
                    // N?u id danh m?c là null -> Khách ðang ? ch? ð? xem "T?t c? bài vi?t"
                    data = await blogService.getAllPosts();
                } else {
                    // N?u id có s? c? th? -> Khách ðang l?c, g?i API l?y bài theo chuyên m?c ðó
                    data = await blogService.getPostsByCategory(selectedBlogCategoryId);
                }

                setPosts(data); // C?p nh?t m?ng d? li?u l?y ðý?c vào state 'posts'

                // X? L? TR?I NGHI?M NGÝ?I DÙNG (UX): T? Ð?NG CU?N TRANG
                // Khi khách b?m l?c, t? ð?ng trý?t tr?nh duy?t lên khu v?c có id="blog"
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    blogSection.scrollIntoView({
                        behavior: 'smooth', // Hi?u ?ng trý?t êm ái
                        block: 'start'      // Cãn mép trên c?a ph?n t? lên sát tr?n tr?nh duy?t
                    });
                }

            } catch (error) {
                // B?t l?i n?u Backend b? s?p ho?c m?t k?t n?i m?ng
                console.error("Quá tr?nh k?t n?i API bài vi?t th?t b?i:", error);
            } finally {
                // Dù thành công hay th?t b?i c?ng ph?i t?t hi?u ?ng loading
                setLoading(false);
            }
        };

        fetchPosts(); // Th?c thi hàm v?a ð?nh ngh?a ? trên
    }, [selectedBlogCategoryId]);

    // 3. KI?M TRA TR?NG THÁI LOADING (HI?N TH? CH?)
    // N?u d? li?u chýa v? k?p, l?p t?c ng?t render và tr? ra giao di?n ch?.
    if (loading) {
        return <div className="text-center my-4 text-muted small"><i className="fas fa-spinner fa-spin mr-2"></i>Ðang t?i tin t?c bài vi?t...</div>;
    }

    // 4. RENDER GIAO DI?N CHÍNH
    return (
        <div className="row">
            {/* N?u m?ng posts tr?ng (không có d? li?u) -> Hi?n thông báo r?ng */}
            {posts.length === 0 ? (
                <div className="col-12 text-center text-muted small py-4 border rounded bg-light">
                    <i className="fa-solid fa-folder-open mb-2 fa-2xl opacity-50"></i>
                    <p className="m-0">Ch? ð? này hi?n chýa có bài vi?t nào.</p>
                </div>
            ) : (
                /* N?U CÓ D? LI?U: Dùng hàm .map() ð? duy?t qua t?ng ph?n t? trong m?ng và t?o ra các kh?i HTML týõng ?ng */
                /* Ð? C?P NH?T LOGIC LIMIT: N?u prop 'limit' có t?n t?i, dùng .slice(0, limit) ð? c?t m?ng l?y ðúng s? lý?ng c?n thi?t (VD: 3 bài). Ngý?c l?i th? l?y toàn b? m?ng. */
                (limit ? posts.slice(0, limit) : posts).map((item) => {

                    // X? L? ?NH HI?N TH?: 
                    // Ki?m tra xem trý?ng imageUrl có t?n t?i không. 
                    // N?u là link ngoài (b?t ð?u b?ng http) th? gi? nguyên, n?u là link c?c b? (/uploads/...) th? ghép v?i IMAGE_BASE_URL.
                    // N?u m?t ?nh trong CSDL th? dùng ?nh gi? (Placeholder).
                    const postImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/150?text=News';

                    return (
                        // B?t bu?c ph?i có thu?c tính key={item.id} ð? ReactJS qu?n l? danh sách và t?i ýu hi?u su?t render
                        <div className="col-12 mb-3" key={item.id}>
                            <div className="card border-0 shadow-sm p-3 rounded">
                                <div className="row align-items-center">

                                    {/* C?T 1: H?NH ?NH */}
                                    <div className="col-md-2 col-3">
                                        <img
                                            src={postImgUrl}
                                            alt={item.title}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ height: '70px', width: '100%', objectFit: 'cover' }}
                                            // S? ki?n d? ph?ng (Fallback): L? h?nh l?i t?i không ðý?c trên web, t? thay b?ng h?nh ch? Error
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                        />
                                    </div>

                                    {/* C?T 2: THÔNG TIN TIÊU Ð? & MÔ T? */}
                                    <div className="col-md-9 col-7">
                                        {/* B?T S? KI?N CLICK (onClick): Truy?n m? bài vi?t (item.id) ngý?c lên cho Component cha ð? m? trang chi ti?t */}
                                        <h6
                                            className="font-weight-bold mb-1 text-dark text-truncate cursor-pointer text-hover-danger"
                                            title={item.title}
                                            onClick={() => onSelectPost(item.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.title}
                                        </h6>
                                        <p className="text-muted small mb-2 text-truncate-2" style={{ lineHeight: '1.4' }}>
                                            {item.shortDescription || item.content || "Nh?n ð? xem chi ti?t n?i dung bài vi?t chia s? v? c?m nang k? thu?t..."}
                                        </p>

                                        {/* HI?N TH? THÔNG TIN PH? (Tag danh m?c, ngày tháng) */}
                                        <div className="d-flex align-items-center text-muted small" style={{ fontSize: '0.8rem' }}>
                                            <span className="badge badge-danger text-white mr-3 px-2 py-1">{item.categoryName || "Tin t?c"}</span>
                                            <span>
                                                <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                                {/* Ð?nh d?ng ngày tháng v? ki?u Vi?t Nam (dd/mm/yyyy) */}
                                                {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "V?a xong"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* C?T 3: NÚT M?I TÊN CHUY?N TRANG */}
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
