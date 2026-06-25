# 📘 ĐỒ ÁN CHUYÊN ĐỀ: ASP.NET CORE + REACTJS
**Hệ thống E-Commerce Phụ tùng Ô tô & Quản lý nội dung (CMS) - KHANHCMS AUTOPARTS**

---
👤 THÔNG TIN SINH VIÊN THỰC HIỆN
Họ và tên: Đồng Phúc Khánh
Mã số sinh viên (MSSV): 2123110051
Lớp: CCQ2311B
Năm thực hiện: 2026

### 👨‍🎓 1. Giới thiệu đề tài
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

### 🎯 2. Mục tiêu đề tài
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

### 🧱 3. Kiến trúc hệ thống
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
🧰 4. Công nghệ sử dụng🔹 BackendASP.NET Core MVC & Web APIEntity Framework Core (EF Core)LINQ (Language Integrated Query)ASP.NET Core IdentityDependency Injection (DI)🔹 FrontendReactJSReact Router DOM (Dynamic Routing, URL Query Parameters)Context API & LocalStorage (State Management cho Giỏ hàng)Axios (Xử lý HTTP Requests)React Hooks (useState, useEffect, useContext, useSearchParams)🔹 Database & Công cụSQL ServerSQL Server Management Studio (SSMS) 21Visual Studio 2022 & Visual Studio CodeNode.jsGit/GitHub📦 5. Cấu trúc dự ánPlaintextCMS Solution
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
⚙️ 6. Chức năng hệ thống🟦
6.1. Quản trị (Admin Panel - ASP.NET MVC)🔐 Quản lý người dùng: Phân quyền, thêm/sửa/xóa tài khoản hệ thống.📂 Quản lý danh mục (Category): Phân loại cây nội dung phụ tùng và bài viết.📦 Quản lý sản phẩm (Product): Upload hình ảnh, cập nhật giá, mô tả sản phẩm.🔗 Quản lý CategoryProduct: Thiết lập quan hệ N-N giữa danh mục và sản phẩm.📝 Quản lý bài viết (Post): Quản trị tin tức bảo dưỡng, kỹ thuật xe.👥 Quản lý khách hàng (Customer): Theo dõi thông tin người mua.🧾 Quản lý đơn hàng (Order & OrderDetail): Xử lý luồng đặt hàng từ phía frontend đẩy về.✅ Chức năng bổ sung: Validate dữ liệu form, giao diện Bootstrap UI thân thiện.
🟩 6.2. Web API (Backend Service)Hệ thống cung cấp kiến trúc API RESTful:MethodEndpointMô tảGET/api/postsLấy danh sách tin tức/bài viếtGET/api/posts/{id}Lấy chi tiết một bài viếtGET/api/categoriesLấy danh sách các danh mụcGET/api/productsLấy toàn bộ danh sách phụ tùngGET/api/ordersTruy xuất danh sách đơn hàngPOST/api/postsTạo mới bài viếtPUT/api/posts/{id}Cập nhật bài viết hiện cóDELETE/api/posts/{id}Xóa bài viết
🟨 6.3. Frontend ReactJS (Customer Portal)Trải nghiệm E-Commerce: Giao diện mua sắm phụ tùng hiện đại, Card hiển thị trực quan.Bộ lọc nâng cao (URL Query): Lọc sản phẩm theo danh mục và lọc theo khoảng giá (click chọn nhanh hoặc nhập tay tự do), đồng bộ 100% với thanh địa chỉ URL.Quản lý Giỏ hàng (CartContext): Thêm, sửa số lượng, xóa sản phẩm. Lưu trữ an toàn trên LocalStorage, tự động tính tổng tiền. Tích hợp tính năng xóa giỏ hàng khi đăng xuất.Giao diện thông minh: Sticky Sidebar ghim menu khi cuộn chuột, chống vỡ layout trên đa thiết bị.
🧠 7. Công nghệ & kỹ thuật áp dụngMVC Pattern (Model - View - Controller).RESTful API Design.Dependency Injection (DI).Entity Framework Core + Code-First Migration.LINQ to Entities.SPA (Single Page Application) Routing.Authentication & Authorization.Separation of Concerns (SoC).Razor View Engine.
🗄️ 8. Database Design (Thiết kế cơ sở dữ liệu)
Category: Id (PK), Name, Description
Product: Id (PK), Name, Price, Description, Image, CategoryId (FK)
Post: Id (PK), Title, Content, Image, CategoryId (FK), CreatedDate
Customer: Id (PK), FullName, Phone, Address, Email
Order: Id (PK), CustomerId (FK), OrderDate, TotalAmountOrderDetail: Id (PK), OrderId (FK), ProductId (FK), Quantity, Price
User: Id (PK), Username, Password, Role
CategoryProduct: CategoryId (FK), ProductId (FK)
🔄 9. Quy trình hoạt động hệ thốngQuản trị viên đăng nhập vào phân hệ MVC Admin Panel.Cập nhật, thêm mới các Master Data: Category, Product, Post. Dữ liệu được EF Core ánh xạ lưu thẳng vào SQL Server.ASP.NET Core Web API trích xuất dữ liệu từ Database, mở các cổng giao tiếp HTTP (Endpoints).ReactJS Frontend kích hoạt các vòng đời (Hooks), sử dụng Axios để call API.Dữ liệu JSON trả về được React bóc tách, đưa vào State và render ra giao diện người dùng cuối (danh sách mặt hàng, tin tức).Người dùng tương tác (lọc giá, thêm giỏ hàng, thanh toán) → React gửi Post Request mang theo Payload về lại API để chốt đơn xuống Database.
🚀 10. Hướng dẫn cài đặt & chạy dự án
🔹 10.1. Clone projectBashgit clone <repository-url>
🔹 10.2. Cấu hình Backend (.NET Core)Bashcd CMS.Backend
# Khôi phục các dependencies
dotnet restore
# Tạo Database từ Migrations
dotnet ef database update
# Khởi chạy server Backend (Mặc định: https://localhost:7004)
dotnet run
🔹 10.3. Cấu hình Frontend (ReactJS)Bashcd cms.frontend
# Cài đặt thư viện Node_Modules
npm install
# Khởi chạy cổng UI Client
npm start
🔐 11. Bảo mật hệ thốngTích hợp ASP.NET Core Identity.Phân quyền luồng Admin chặt chẽ (Authentication / Authorization).Validate dữ liệu đầu vào hai lớp (Client-side & Server-side).Kiểm soát Cors, ngăn chặn truy cập API trái phép.
📊 12. Ưu điểm của hệ thốngKiến trúc phân tầng rõ ràng, dễ dàng Unit Test và mở rộng tính năng.Tách biệt hoàn toàn Frontend & Backend (Decoupled architecture).Sử dụng LocalStorage & Context tối ưu hóa tốc độ tải giỏ hàng, giảm tải query cho Server.Định tuyến động (URL Parameters) thân thiện với thói quen chia sẻ link của người mua sắm.Giao diện quản trị dễ sử dụng, quản lý đa cấu trúc nội dung.
📌 13. Hướng phát triển trong tương laiTích hợp JSON Web Token (JWT) Authorization cho API.Sử dụng Cloud Storage (Cloudinary/AWS Blob) để quản lý tệp tĩnh (hình ảnh).Phát triển Dashboard báo cáo doanh thu dưới dạng Chart/Biểu đồ động.Tích hợp cổng thanh toán trực tuyến (VNPay / MoMo).Tối ưu hóa SEO cho Frontend (Nâng cấp lên kiến trúc SSR bằng Next.js).Đóng gói hệ thống thông qua Docker & xây dựng luồng CI/CD.
👨‍💻 14. Kết luậnDự án CMS KHANHCMS AUTOPARTS là một giải pháp Full-stack hoàn chỉnh, giúp đúc kết và minh chứng khả năng:Hiểu sâu sắc về thiết kế kiến trúc phần mềm lai hiện đại.Nắm vững công cụ back-end mạnh mẽ ASP.NET Core & EF Core.Khai thác sức mạnh của Single Page Application với ReactJS.Tư duy giải quyết bài toán nghiệp vụ thương mại điện tử thực tế.Đáp ứng quy trình vòng đời phát triển phần mềm chuẩn doanh nghiệp.
⭐ 15. Tác giả Sinh viên: Đồng Phúc Khánh
MSSV: 2123110051
Trường: Cao đẳng Công nghệ Thành phố Hồ Chí Minh
Chuyên đề: ASP.NET Core & ReactJS
Năm học: 2026
