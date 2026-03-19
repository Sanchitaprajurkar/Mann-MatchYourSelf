# Mann Match Your Self - MERN E-Commerce Platform

A full-stack e-commerce platform built with MERN stack, featuring admin dashboard, product management, order processing, payment integration, and email notifications.

## 🚀 Features

### **Frontend Features**

- **User Authentication** - Login/Register with JWT tokens
- **Product Catalog** - Browse products by category
- **Shopping Cart** - Add/remove items, update quantities
- **Checkout Process** - Complete order with shipping details
- **Payment Integration** - Razorpay payment gateway
- **Admin Dashboard** - Complete admin management system
- **Responsive Design** - Mobile-friendly interface

### **Backend Features**

- **RESTful APIs** - Complete CRUD operations
- **JWT Authentication** - Secure user authentication
- **Role-Based Access** - Admin/user role management
- **Product Management** - Image uploads with Cloudinary
- **Order Processing** - Complete order lifecycle
- **Payment Integration** - Razorpay order creation & verification
- **Email Notifications** - Order confirmations via Nodemailer
- **Database Integration** - MongoDB with Mongoose ODM

### **Admin Dashboard Features**

- **Dashboard Overview** - Real-time statistics
- **Product Management** - Create, edit, delete products
- **Order Management** - View and update order status
- **User Management** - Admin-only access control
- **Analytics** - Order and product statistics

## 🛠 Tech Stack

### **Frontend**

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### **Integrations**

- **Cloudinary** - Image storage and CDN
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Multer** - File upload middleware

## 📁 Project Structure

```
mann-match-yourself/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   │   ├── vite.svg
│   │   └── ...
│   ├── src/                         # Source code
│   │   ├── admin/                   # Admin dashboard components
│   │   │   ├── AdminLayout.tsx        # Admin layout wrapper
│   │   │   ├── AdminDashboard.tsx     # Dashboard overview
│   │   │   ├── AdminProducts.tsx      # Product management
│   │   │   └── AdminOrders.tsx        # Order management
│   │   ├── api/                     # API configuration
│   │   │   └── axios.ts             # Axios instance with interceptors
│   │   ├── components/               # Reusable components
│   │   │   └── ...
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.tsx       # Authentication context
│   │   ├── layouts/                 # Page layouts
│   │   │   └── MainLayout.tsx       # Main app layout
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Home page
│   │   │   ├── Shop.tsx             # Product listing
│   │   │   ├── ProductDetails.tsx    # Product details
│   │   │   ├── Cart.tsx             # Shopping cart
│   │   │   ├── Checkout.tsx         # Checkout process
│   │   │   └── Login.tsx            # User authentication
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # App entry point
│   │   └── index.css               # Global styles
│   ├── .gitignore                   # Git ignore file
│   ├── eslint.config.js              # ESLint configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies and scripts
│   └── README.md                   # This file
├── server/                         # Node.js backend
│   ├── config/                      # Configuration files
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── db.js                  # Database connection
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js         # Authentication logic
│   │   ├── orderController.js        # Order management
│   │   ├── paymentController.js      # Payment processing
│   │   └── productController.js      # Product CRUD operations
│   ├── middleware/                  # Custom middleware
│   │   ├── authMiddleware.js         # JWT authentication
│   │   ├── isAdmin.js               # Admin role check
│   │   ├── requireAdmin.js          # Admin access middleware
│   │   └── uploadMiddleware.js      # File upload handling
│   ├── models/                      # Mongoose models
│   │   ├── User.js                 # User schema
│   │   ├── Product.js              # Product schema
│   │   └── Order.js               # Order schema
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── orderRoutes.js          # Order endpoints
│   │   ├── paymentRoutes.js         # Payment endpoints
│   │   └── productRoutes.js        # Product endpoints
│   ├── utils/                       # Utility functions
│   │   └── sendEmail.js           # Email service
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies and scripts
│   ├── server.js                   # Main server file
│   └── test-db.js                 # Database connection test
└── README.md                       # Project documentation
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Git

### **Environment Variables**

#### **Server (.env)**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mann-match-yourself
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **Installation Steps**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sanchitaprajurkar/Mann-Match-Your-Self.git
   cd mann-match-yourself
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Copy `.env.example` to `.env` in server directory
   - Fill in all required environment variables

5. **Start the development servers**

   **Terminal 1 - Backend Server:**

   ```bash
   cd server
   npm run dev
   ```

   Server runs on: `http://localhost:5000`

   **Terminal 2 - Frontend Development:**

   ```bash
   cd client
   npm run dev
   ```

   Frontend runs on: `http://localhost:5173`

## 🔗 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Products**

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### **Orders**

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/admin` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### **Payments**

- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## 🎯 Admin Dashboard Access

### **Login Credentials**

- **Email**: `admin@example.com`
- **Password**: `admin123`

### **Admin Routes**

- `/admin/dashboard` - Dashboard overview with statistics
- `/admin/products` - Product management interface
- `/admin/orders` - Order management with status updates

## 🔧 Development Scripts

### **Server Scripts**

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "node test-db.js"
}
```

### **Client Scripts**

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 📦 Dependencies

### **Server Dependencies**

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **cloudinary** - Image storage
- **razorpay** - Payment gateway
- **nodemailer** - Email service
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### **Client Dependencies**

- **react** - UI framework
- **react-dom** - DOM rendering
- **react-router-dom** - Client routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **typescript** - Type safety

## 🎨 UI Components

### **Admin Dashboard**

- **Dashboard Overview** - Real-time statistics cards
- **Product Management** - CRUD operations with forms
- **Order Management** - Table view with status updates
- **Responsive Layout** - Mobile-friendly design

### **User Interface**

- **Product Catalog** - Grid layout with filters
- **Shopping Cart** - Dynamic cart management
- **Checkout Process** - Multi-step checkout form
- **Authentication** - Login/register forms

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Role-Based Access** - Admin-only routes protection
- **Input Validation** - Form validation and sanitization
- **CORS Configuration** - Cross-origin security

## 📧 Email Notifications

### **Order Events**

- **Order Confirmation** - Sent when order is placed
- **Order Delivered** - Sent when order is marked delivered
- **Admin Notifications** - Order status updates

### **Email Templates**

- **HTML Templates** - Styled email content
- **Dynamic Content** - Order details insertion
- **Responsive Design** - Mobile-friendly emails

## 💳 Payment Integration

### **Razorpay Flow**

1. **Order Creation** - Create Razorpay order
2. **Payment Processing** - User completes payment
3. **Payment Verification** - Server verifies signature
4. **Order Confirmation** - Update order status

## 🖼 Image Management

### **Cloudinary Integration**

- **Automatic Upload** - Direct upload to Cloudinary
- **Image Optimization** - Automatic compression
- **CDN Delivery** - Fast image loading
- **Multiple Formats** - Responsive image variants

## 🚀 Deployment

### **Environment Setup**

- **Production Variables** - Secure environment config
- **Database Connection** - MongoDB Atlas or similar
- **SSL Configuration** - HTTPS setup
- **Domain Configuration** - Custom domain setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- **Email**: support@mann-match-yourself.com
- **GitHub Issues**: [Create an issue](https://github.com/Sanchitaprajurkar/Mann-Match-Your-Self/issues)

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Admin dashboard integration
- **v1.2.0** - Payment gateway integration
- **v1.3.0** - Email notifications system

---

**Built with ❤️ using MERN stack**

---

# **📁 DETAILED FOLDER STRUCTURE**

## **📁 ROOT DIRECTORY**

```
Mann-Match-Your-Self/
├── .git/                          # Git version control directory
├── .gitignore                     # Git ignore file - specifies files to exclude from version control
├── README.md                      # Project documentation and setup instructions
├── client/                        # Frontend React application
└── server/                        # Backend Node.js/Express API
```

---

## **📁 CLIENT (FRONTEND)**

```
client/
├── .gitignore                     # Frontend Git ignore file
├── README.md                      # Frontend-specific documentation
├── changes.md                     # Change log or project notes
├── eslint.config.js               # ESLint configuration for code linting
├── index.html                     # Main HTML entry point for React app
├── package-lock.json              # Lock file for dependency versions
├── package.json                   # Frontend dependencies and scripts
├── vite.config.js                 # Vite build tool configuration
├── public/                        # Static assets directory
└── src/                           # Main source code directory
```

### **📁 CLIENT/SRC**

```
src/
├── App.css                        # Main application styles
├── App.tsx                        # Root React component with routing
├── index.css                      # Global CSS styles
├── main.tsx                       # Application entry point
├── admin/                         # Admin panel components
│   ├── AdminLayout.tsx            # ✅ Standardized admin layout with sidebar & header
│   ├── AdminProducts.tsx          # ✅ Product management with design system
│   ├── AdminAddProduct.tsx        # Add new product form
│   ├── AdminEditProduct.tsx       # Edit existing product
│   ├── AdminDashboard.tsx         # Dashboard overview & statistics
│   ├── AdminHero.tsx              # Hero banner management
│   └── AdminOrders.tsx            # Order management interface
├── api/                           # API configuration and utilities
│   └── axios.ts                   # Axios instance with interceptors
├── assets/                        # Static assets (images, icons)
├── components/                    # Reusable UI components
│   └── admin/                     # ✅ Admin-specific reusable components
│       ├── AdminButton.tsx        # ✅ Standardized button component
│       ├── AdminInput.tsx         # ✅ Standardized input component
│       ├── AdminCard.tsx          # ✅ Reusable card component
│       ├── AdminEmptyState.tsx    # ✅ Empty state component
│       └── index.ts               # Component exports
├── context/                       # React context providers
│   ├── AuthContext.tsx            # Authentication context
│   ├── CartContext.tsx            # Shopping cart context
│   └── WishlistContext.tsx        # Wishlist context
├── data/                          # Static data and mock data
│   └── mockData.ts                 # Mock product data
├── hooks/                         # Custom React hooks
│   └── useAdminAuth.ts            # Admin authentication hook
├── pages/                         # Page components
│   ├── Login.tsx                   # Login page (user & admin)
│   ├── Shop.tsx                    # Main shopping page
│   └── admin/                      # Admin-specific pages
├── services/                      # API service functions
│   ├── authService.ts             # User authentication service
│   ├── adminAuthService.ts        # Admin authentication service
│   └── adminService.ts            # Admin API services
└── styles/                        # Styling and design system
    └── theme.css                   # ✅ MANN design system variables & admin styles
```

---

## **📁 SERVER (BACKEND)**

```
server/
├── .gitignore                     # Backend Git ignore file
├── package-lock.json              # Lock file for dependency versions
├── package.json                   # Backend dependencies and scripts
├── server.js                      # Main server entry point
├── config/                        # Configuration files
│   └── cloudinary.js              # Cloudinary image upload config
├── controllers/                   # Business logic controllers
│   ├── adminController.js         # Admin dashboard & management
│   ├── authController.js          # Authentication logic
│   ├── heroController.js          # Hero banner management
│   ├── orderController.js         # Order processing
│   └── productController.js       # Product CRUD operations
├── middleware/                    # Custom middleware functions
│   ├── adminAuth.js               # Admin authentication middleware
│   └── uploadMiddleware.js        # File upload handling
├── models/                        # Mongoose data models
│   ├── Admin.js                   # ✅ Admin user model with password hashing
│   ├── Order.js                   # Order model
│   └── Product.js                 # ✅ Product model (createdBy field optional)
├── routes/                        # API route definitions
│   ├── admin.js                   # ✅ Admin authentication & management routes
│   ├── auth.js                    # User authentication routes
│   ├── heroRoutes.js              # Hero banner routes
│   ├── orderRoutes.js             # Order management routes
│   └── productRoutes.js           # Product CRUD routes
└── utils/                         # Utility functions
    └── emailService.js             # Email notification service
```

---

## **🎯 RECENT IMPLEMENTATIONS**

### **✅ ADMIN AUTHENTICATION SYSTEM**

- **JWT-based authentication** for admin users
- **Secure login/logout** functionality
- **Protected admin routes** with middleware
- **Token validation** and session management
- **Admin credentials:** `admin@mann.com` / `admin123`

### **✅ ADMIN FRONTEND DESIGN SYSTEM**

- **MANN Brand Colors:** Charcoal Black (#1A1A1A), Antique Gold (#C5A059), Pure White (#FFFFFF)
- **Typography:** Playfair Display (serif) + Inter (sans)
- **8px Grid System:** Consistent spacing throughout
- **Reusable Components:** AdminButton, AdminInput, AdminCard, AdminEmptyState
- **Responsive Design:** Mobile-friendly admin interface

### **✅ PRODUCT MANAGEMENT**

- **Data Persistence:** Products save correctly to MongoDB
- **Frontend Sync:** Admin-added products appear on user frontend
- **CRUD Operations:** Create, read, update, delete products
- **Image Upload:** Cloudinary integration for product images
- **Search & Filter:** Real-time product search and category filtering

### **✅ ADMIN LAYOUT & NAVIGATION**

- **Sidebar Navigation:** Collapsible menu with all admin sections
- **Header Section:** Page titles and admin info
- **Content Outlet:** Clean content area for admin pages
- **Consistent Styling:** Professional boutique aesthetic

---

## **🔧 TECHNICAL FIXES APPLIED**

### **Authentication Issues Resolved:**

- Fixed `req.user._id` undefined error in product creation
- Made `createdBy` field optional in Product schema
- Added proper admin authentication routes
- Fixed frontend login response handling

### **Data Sync Issues Resolved:**

- Fixed admin panel data not appearing on user frontend
- Resolved frontend filter issues (removed strict image requirement)
- Fixed API endpoint consistency between admin and user routes
- Verified end-to-end data flow from admin to frontend

### **Design System Implementation:**

- Standardized all admin components with consistent styling
- Removed inline colors and implemented CSS variables
- Applied proper font hierarchy (serif for headings, sans for UI)
- Implemented 8px grid spacing system throughout

---

## **🚀 PRODUCTION READY FEATURES**

### **Admin Panel:**

- ✅ Complete authentication system
- ✅ Standardized design system
- ✅ Product management interface
- ✅ Responsive layout
- ✅ Professional boutique aesthetic

### **Backend:**

- ✅ Secure JWT authentication
- ✅ RESTful API endpoints
- ✅ MongoDB integration
- ✅ Image upload with Cloudinary
- ✅ Error handling and validation

### **Frontend:**

- ✅ React 18 + TypeScript
- ✅ Tailwind CSS styling
- ✅ Component reusability
- ✅ State management with Context
- ✅ Responsive design

---

**Built with ❤️ using MERN stack**

---

**Built with ❤️ using MERN stack**

---

## **📁 SERVER (BACKEND)**

```

server/
├── .env # Environment variables (database, JWT, etc.)
├── create-admin.js # Script to create admin user
├── package-lock.json # Lock file for dependency versions
├── package.json # Backend dependencies and scripts
├── server.js # Main server entry point
├── setup-routes.js # Alternative route setup file
├── test-db.js # Database connection test script
├── test-upload.html # File upload testing interface
├── config/ # Configuration files
├── controllers/ # Request handlers and business logic
├── middleware/ # Custom middleware functions
├── models/ # Database schema models
├── routes/ # API route definitions
├── uploads/ # File upload storage directory
└── utils/ # Utility functions

```

### **📁 SERVER/CONFIG**

```

config/
├── cloudinary.js # Cloudinary image storage configuration
└── db.js # MongoDB database connection setup

```

### **📁 SERVER/CONTROLLERS**

```

controllers/
├── adminController.js # Admin dashboard and management logic
├── authController.js # Authentication (login/logout) logic
├── cartController.js # Shopping cart operations
├── heroController.js # Hero slider management
├── orderController.js # Order processing and management
├── paymentController.js # Payment processing logic
├── productController.js # Product CRUD operations
├── uploadController.js # File upload handling
└── wishlistController.js # Wishlist operations

```

### **📁 SERVER/MIDDLEWARE**

```

middleware/
├── authMiddleware.js # JWT authentication middleware
├── simpleUpload.js # Basic file upload middleware
└── uploadMiddleware.js # Advanced file upload configuration

```

### **📁 SERVER/MODELS**

```

models/
├── Admin.js # Admin user schema and model
├── HeroSlide.js # Hero slide data model
├── Order.js # Order data schema
├── Product.js # Product data schema
└── User.js # Regular user schema

```

### **📁 SERVER/ROUTES**

```

routes/
├── admin.js # Admin-specific API routes
├── auth.js # Authentication routes (login/logout)
├── authRoutes.js # Alternative authentication routes
├── cartRoutes.js # Shopping cart API endpoints
├── heroRoutes.js # Hero slider management routes
├── instagramRoutes.js # Instagram integration routes
├── orderRoutes.js # Order management API
├── paymentRoutes.js # Payment processing endpoints
├── productRoutes.js # Product CRUD API routes
├── uploadRoutes.js # File upload endpoints
└── wishlistRoutes.js # Wishlist API endpoints

```

### **📁 SERVER/UTILS**

```

utils/
└── sendEmail.js # Email sending utility functions

```

---

## **🔧 KEY TECHNOLOGIES**

**Frontend:**

- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Tailwind CSS (styling)
- Axios (API calls)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Cloudinary (image storage)
- Multer (file uploads)

**Features:**

- Admin Dashboard
- Product Management
- Order Processing
- Payment Integration
- Email Notifications
- Image Upload System
- User Authentication
- Shopping Cart & Wishlist
