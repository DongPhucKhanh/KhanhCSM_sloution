# 📘 ĐỒ ÁN CHUYÊN ĐỀ: ASP.NET CORE + REACTJS
**Hệ thống E-Commerce Phụ tùng Ô tô & Quản lý nội dung (CMS) - KHANHCMS AUTOPARTS**
---
## 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
- **Họ và tên:** Đồng Phúc Khánh
- **Mã số sinh viên (MSSV):** 2123110051
- **Lớp:** CCQ2311B
- **Năm thực hiện:** 2026
---
## 👨‍🎓 1. Giới thiệu đề tài
Dự án CMS (Content Management System) & E-Commerce **KHANHCMS** là một hệ thống quản lý nội dung và bán hàng được xây dựng theo mô hình Fullstack hiện đại, kết hợp:
* **Backend:** ASP.NET Core MVC + Web API
* **Frontend:** ReactJS (Single Page Application - SPA)
* **Database:** SQL Server
* **ORM:** Entity Framework Core
Hệ thống cho phép quản trị viên vận hành linh hoạt các luồng dữ liệu cốt lõi:
* Danh mục sản phẩm (Category)
* Sản phẩm (Product)
* Bài viết / Tin tức (Post)
* Khách hàng (Customer)
* Đơn hàng & Chi tiết đơn hàng (Order / OrderDetail)
* Tài khoản hệ thống (User)
* Quan hệ danh mục – sản phẩm (CategoryProduct)
Ngoài ra, hệ thống cung cấp luồng Web API RESTful mạnh mẽ để Client-side (ReactJS) giao tiếp, render giao diện động và quản lý giỏ hàng trực tuyến.
---
## 🎯 2. Mục tiêu đề tài
Đề tài được xây dựng nhằm mục đích:
* Nắm vững và vận hành kiến trúc **3-Layer Architecture**.
* Hiểu và sử dụng **Entity Framework Core + Code-First Migration**.
* Thành thạo truy vấn, xử lý dữ liệu với **LINQ**.
* Xây dựng hệ thống CRUD hoàn chỉnh theo quy chuẩn bảo mật.
* Phát triển **Web API RESTful** cung cấp dữ liệu độc lập.
* Tích hợp frontend SPA bằng **ReactJS** (Routing, State Management, Hooks).
* Áp dụng **Authentication & Authorization** cho luồng quản trị.
* Trải nghiệm xây dựng hệ thống quản lý dữ liệu thực tế theo mô hình doanh nghiệp chuỗi cung ứng.
---
## 🧱 3. Kiến trúc hệ thống
```text
[ Frontend (ReactJS - SPA) ]
           ↓ (HTTP / Axios)
[ Backend API (ASP.NET Core Web API) ]
           ↓
[ Business Logic (Service + LINQ) ]
           ↓
[ Data Access Layer (Entity Framework Core) ]
           ↓
[ Database (SQL Server - CMS_DB) ]
🧰 4. Công nghệ sử dụng
🔹 Backend
ASP.NET Core MVC & Web API
Entity Framework Core (EF Core)
LINQ (Language Integrated Query)
ASP.NET Core Identity
Dependency Injection (DI)
🔹 Frontend
ReactJS
React Router DOM (Dynamic Routing, URL Query Parameters)
Context API & LocalStorage (State Management cho Giỏ hàng)
Axios (Xử lý HTTP Requests)
React Hooks (useState, useEffect, useContext, useSearchParams)
🔹 Database & Công cụ
SQL Server
SQL Server Management Studio (SSMS) 21
Visual Studio 2022 & Visual Studio Code
Node.js
Git/GitHub
📦 5. Cấu trúc dự án
text


CMS Solution
│
├── CMS.Backend (ASP.NET Core MVC + Web API)
│   ├── Controllers
│   │   ├── CategoryController.cs
│   │   ├── CategoryProductController.cs
│   │   ├── CustomerController.cs
│   │   ├── HomeController.cs
│   │   ├── OrderController.cs
│   │   ├── OrderDetailController.cs
│   │   ├── PostController.cs
│   │   ├── ProductController.cs
│   │   └── UserController.cs
│   ├── Models
│   ├── Views (Razor Views cho giao diện Admin)
│   ├── wwwroot
│   ├── appsettings.json
│   └── Program.cs
│
├── CMS.Data (Class Library)
│   ├── Entities
│   │   ├── Category.cs
│   │   ├── CategoryProduct.cs
│   │   ├── Customer.cs
│   │   ├── Order.cs
│   │   ├── OrderDetail.cs
│   │   ├── Post.cs
│   │   ├── Product.cs
│   │   └── User.cs
│   ├── Migrations
│   └── ApplicationDbContext.cs
│
├── cms.frontend (ReactJS Client-side)
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── components (ProductList, Cart, CategoryProductList,...)
│   │   ├── context (CartContext)
│   │   ├── services (productService, api...)
│   │   ├── App.js (Cấu hình Route tĩnh & động)
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
└── Database (SQL Server - CMS_DB)
⚙️ 6. Chức năng hệ thống
🟦 6.1. Quản trị (Admin Panel - ASP.NET MVC)
🔐 Quản lý người dùng: Phân quyền, thêm/sửa/xóa tài khoản hệ thống.
📂 Quản lý danh mục (Category): Phân loại cây nội dung phụ tùng và bài viết.
📦 Quản lý sản phẩm (Product): Upload hình ảnh, cập nhật giá, mô tả sản phẩm.
🔗 Quản lý CategoryProduct: Thiết lập quan hệ N-N giữa danh mục và sản phẩm.
📝 Quản lý bài viết (Post): Quản trị tin tức bảo dưỡng, kỹ thuật xe.
👥 Quản lý khách hàng (Customer): Theo dõi thông tin người mua.
🧾 Quản lý đơn hàng (Order & OrderDetail): Xử lý luồng đặt hàng từ phía frontend đẩy về.
✅ Chức năng bổ sung: Phân trang đồng bộ, Validate dữ liệu form, giao diện Bootstrap UI thân thiện.
🟩 6.2. Web API (Backend Service)
Hệ thống cung cấp kiến trúc API RESTful:

Method	Endpoint	Mô tả
GET	/api/posts	Lấy danh sách tin tức/bài viết
GET	/api/posts/{id}	Lấy chi tiết một bài viết
GET	/api/categories	Lấy danh sách các danh mục
GET	/api/products	Lấy toàn bộ danh sách phụ tùng
GET	/api/orders	Truy xuất danh sách đơn hàng
POST	/api/posts	Tạo mới bài viết
PUT	/api/posts/{id}	Cập nhật bài viết hiện có
DELETE	/api/posts/{id}	Xóa bài viết
🟨 6.3. Frontend ReactJS (Customer Portal)
Trải nghiệm E-Commerce: Giao diện mua sắm phụ tùng hiện đại, Card hiển thị trực quan.
Tính năng Gợi ý tìm kiếm (Live Search): Box thả xuống gợi ý sản phẩm cực kỳ thông minh.
Bộ lọc nâng cao (URL Query): Lọc sản phẩm theo danh mục và lọc theo khoảng giá (click chọn nhanh hoặc nhập tay tự do), đồng bộ 100% với thanh địa chỉ URL.
Quản lý Giỏ hàng (CartContext): Thêm, sửa số lượng, xóa sản phẩm. Lưu trữ an toàn trên LocalStorage, tự động tính tổng tiền. Tích hợp tính năng xóa giỏ hàng khi đăng xuất.
Giao diện thông minh: Sticky Sidebar ghim menu khi cuộn chuột, chống vỡ layout trên đa thiết bị.
🧠 7. Công nghệ & kỹ thuật áp dụng
MVC Pattern (Model - View - Controller).
RESTful API Design.
Dependency Injection (DI).
Entity Framework Core + Code-First Migration.
LINQ to Entities.
SPA (Single Page Application) Routing.
Authentication & Authorization.
Separation of Concerns (SoC).
Razor View Engine.
🗄️ 8. Database Design (Thiết kế cơ sở dữ liệu)
Category: Id (PK), Name, Description
Product: Id (PK), Name, Price, Description, Image, CategoryId (FK)
Post: Id (PK), Title, Content, Image, CategoryId (FK), CreatedDate
Customer: Id (PK), FullName, Phone, Address, Email
Order: Id (PK), CustomerId (FK), OrderDate, TotalAmount
OrderDetail: Id (PK), OrderId (FK), ProductId (FK), Quantity, Price
User: Id (PK), Username, Password, Role
CategoryProduct: CategoryId (FK), ProductId (FK)
🔄 9. Quy trình hoạt động hệ thống
Quản trị viên đăng nhập vào phân hệ MVC Admin Panel.
Cập nhật, thêm mới các Master Data: Category, Product, Post. Dữ liệu được EF Core ánh xạ lưu thẳng vào SQL Server.
ASP.NET Core Web API trích xuất dữ liệu từ Database, mở các cổng giao tiếp HTTP (Endpoints).
ReactJS Frontend kích hoạt các vòng đời (Hooks), sử dụng Axios để call API.
Dữ liệu JSON trả về được React bóc tách, đưa vào State và render ra giao diện người dùng cuối (danh sách mặt hàng, tin tức).
Người dùng tương tác (lọc giá, thêm giỏ hàng, thanh toán) → React gửi Post Request mang theo Payload về lại API để chốt đơn xuống Database.
🚀 10. Hướng dẫn cài đặt & chạy dự án
🔹 10.1. Clone project
bash


git clone <repository-url>
🔹 10.2. Cấu hình Backend (.NET Core)
Mở file KhanhCMS_Solution.sln bằng Visual Studio.
Đảm bảo cấu hình ConnectionString trong file appsettings.json đã trỏ đúng vào SQL Server.
Khôi phục packages và tạo Database từ Migrations:
bash


cd CMS.Backend
dotnet restore
dotnet ef database update
Khởi chạy server Backend (Nhấn phím F5 hoặc dùng lệnh sau, mặc định: https://localhost:7004)
bash


dotnet run
🔹 10.3. Cấu hình Frontend (ReactJS)
bash


cd cms.frontend
# Cài đặt thư viện Node_Modules
npm install
# Khởi chạy cổng UI Client
npm start
Hệ thống sẽ tự động mở tab trình duyệt tại địa chỉ http://localhost:3000.

🔐 11. Bảo mật hệ thống
Tích hợp ASP.NET Core Identity.
Phân quyền luồng Admin chặt chẽ (Authentication / Authorization).
Validate dữ liệu đầu vào hai lớp (Client-side & Server-side).
Kiểm soát Cors, ngăn chặn truy cập API trái phép.
📊 12. Ưu điểm của hệ thống
Kiến trúc phân tầng rõ ràng, dễ dàng Unit Test và mở rộng tính năng.
Tách biệt hoàn toàn Frontend & Backend (Decoupled architecture).
Sử dụng LocalStorage & Context tối ưu hóa tốc độ tải giỏ hàng, giảm tải query cho Server.
Định tuyến động (URL Parameters) thân thiện với thói quen chia sẻ link của người mua sắm.
Giao diện quản trị dễ sử dụng, quản lý đa cấu trúc nội dung.
📅 13. TIẾN ĐỘ HOÀN THIỆN TOÀN TẬP (TỪ BUỔI 1 ĐẾN BUỔI 9)
Xuyên suốt quá trình học và thực hành chuyên đề, dự án đã được hoàn thiện theo lộ trình 9 buổi bài bản như sau:

Buổi 1: Khởi tạo Solution và Database
Khởi tạo kiến trúc 3 lớp (Web, Data, Core).
Phân tích thiết kế Database phụ tùng ô tô.
Cài đặt Entity Framework Core và sử dụng Code-First Migration để tự động hóa tạo CSDL SQL Server.
Buổi 2: Xây dựng CRUD cơ bản trên ASP.NET Core MVC
Thiết lập Repository và Dependency Injection (DI).
Xây dựng hoàn chỉnh luồng Thêm/Sửa/Xóa/Xem cho Category và Product.
Buổi 3: Hoàn thiện Admin Panel và Upload File
Áp dụng Template Bootstrap vào Razor Views để làm Dashboard quản trị.
Xử lý nghiệp vụ Upload hình ảnh sản phẩm/bài viết, quản lý thư mục tĩnh wwwroot/images.
Buổi 4: Phân trang và Cấu trúc quan hệ phức tạp
Xử lý quan hệ N-N (Nhiều-Nhiều) giữa Danh mục và Sản phẩm.
Triển khai thuật toán phân trang (Pagination) bằng LINQ Skip và Take trên 100% các chức năng quản lý.
Buổi 5: Xây dựng RESTful Web API
Tạo các API Controllers, thiết lập chuẩn HTTP (GET, POST, PUT, DELETE).
Cấu hình CORS để cho phép ứng dụng Frontend khác miền gọi được dữ liệu.
Thử nghiệm trên Swagger UI.
Buổi 6: Khởi tạo ReactJS & Routing
Tạo project cms.frontend bằng create-react-app.
Cấu hình Layout (Header, Footer) và react-router-dom (chia trang Home, Shop, Blog, Cart, Checkout).
Buổi 7: Tích hợp API lên Frontend & Tính năng Tìm kiếm
Gọi API từ React bằng thư viện Axios.
Hiển thị Lưới sản phẩm, Slider Banner.
Làm tính năng Lọc sản phẩm theo khoảng giá và Live Search (Gợi ý tìm kiếm nhanh).
Buổi 8: Quản lý Giỏ hàng (Cart) với Context API
Sử dụng React Context và Hook useReducer / useState để xây dựng Giỏ hàng toàn cục.
Lưu dữ liệu Giỏ hàng ngầm vào trình duyệt qua LocalStorage.
Buổi 9: Hoàn thiện luồng Đặt hàng (Checkout) & Bảo mật
Khách hàng điền form, Frontend đóng gói JSON đẩy về Web API. Backend lưu Đơn hàng (Order và OrderDetail) vào CSDL SQL Server, đồng thời trừ kho tự động.
Tích hợp đăng nhập, đăng ký Identity, phân quyền tài khoản Quản trị viên (Admin). Kiểm tra tổng thể dự án.
📌 14. Hướng phát triển trong tương lai
Tích hợp JSON Web Token (JWT) Authorization cho API độc lập.
Sử dụng Cloud Storage (Cloudinary/AWS Blob) để quản lý tệp tĩnh (hình ảnh).
Phát triển Dashboard báo cáo doanh thu dưới dạng Chart/Biểu đồ động.
Tích hợp cổng thanh toán trực tuyến (VNPay / MoMo).
Tối ưu hóa SEO cho Frontend (Nâng cấp lên kiến trúc SSR bằng Next.js).
Đóng gói hệ thống thông qua Docker & xây dựng luồng CI/CD.
👨‍💻 15. Kết luận
Dự án CMS KHANHCMS AUTOPARTS là một giải pháp Full-stack hoàn chỉnh, giúp đúc kết và minh chứng khả năng:

Hiểu sâu sắc về thiết kế kiến trúc phần mềm lai hiện đại.
Nắm vững công cụ back-end mạnh mẽ ASP.NET Core & EF Core.
Khai thác sức mạnh của Single Page Application với ReactJS.
Tư duy giải quyết bài toán nghiệp vụ thương mại điện tử thực tế.
Đáp ứng quy trình vòng đời phát triển phần mềm chuẩn doanh nghiệp.
⭐ Tác giả Sinh viên: Đồng Phúc Khánh
Trường: Cao đẳng Công nghệ Thành phố Hồ Chí Minh
Chuyên đề: ASP.NET Core & ReactJS
Năm học: 2026
