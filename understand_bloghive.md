# BlogHive - Technical Documentation & Analysis

## 📋 Project Overview
**BlogHive** is a full-stack blogging platform that allows users to create, publish, and manage blog posts with social features like following, liking, and commenting.

---

## ✨ Platform Features

### 🎯 Core Features
1. **User Authentication**
   - Email and password-based registration
   - OTP (One-Time Password) verification via email for account activation
   - Secure login with JWT token-based authentication
   - Persistent login sessions (stay logged in across browser sessions)
   - Password change functionality for existing users
   - Logout with complete session cleanup

2. **Blog Management**
   - Create blog posts with rich text editor (WYSIWYG)
   - Support for headings, bold, italic, lists, code blocks, blockquotes, and links
   - Image upload and embedding directly in blog content
   - Edit your own published blog posts
   - Delete your own blog posts
   - Automatic slug generation for SEO-friendly URLs
   - View count tracking for each blog post

3. **Social Interaction**
   - **Follow System**: Follow other users to see their content
   - **Like System**: Like blog posts you enjoy
   - **Comment System**: Add comments on any blog post
   - View follower and following counts on user profiles
   - See total post count for each user

4. **Discovery & Search**
   - Browse all published blog posts
   - Search blogs by keywords
   - View user-specific blog collections
   - Visit user profiles to explore their content

5. **Profile Management**
   - Update profile information (name, username, email, gender)
   - Upload and change profile avatar/picture
   - View your own posts, followers, and following
   - Public profile page viewable by all visitors

### 👤 User Roles & Permissions

#### **Visitor (Not Logged In)**
**CAN DO:**
- ✅ View the homepage and landing page content
- ✅ Browse all published blog posts
- ✅ Read complete blog post content
- ✅ View blog post comments
- ✅ View user profiles (posts, follower/following counts)
- ✅ Search for blog posts by keywords
- ✅ Register for a new account
- ✅ Login to existing account

**CANNOT DO:**
- ❌ Create, edit, or delete blog posts
- ❌ Like or unlike blog posts
- ❌ Comment on blog posts
- ❌ Follow or unfollow users
- ❌ Access user settings or profile edit pages
- ❌ Upload images

#### **Registered User (Logged In)**
**CAN DO EVERYTHING VISITORS CAN, PLUS:**
- ✅ Create new blog posts with rich text formatting
- ✅ Edit their own blog posts
- ✅ Delete their own blog posts
- ✅ Upload images to Cloudinary via the editor
- ✅ Like/unlike any blog post
- ✅ Comment on any blog post
- ✅ Follow/unfollow other users
- ✅ Update their profile information
- ✅ Change their profile avatar/picture
- ✅ Change their account password
- ✅ Logout from their account
- ✅ See personalized content based on who they follow

**CANNOT DO:**
- ❌ Edit or delete other users' blog posts
- ❌ Delete other users' comments
- ❌ Modify other users' profiles
- ❌ Access admin features (no admin role currently)

---

## 🏗️ Architecture

### Technology Stack

#### **Frontend (Client)**

##### Core Framework & Build Tools
- **React 18.3.1**: A JavaScript library for building user interfaces using component-based architecture. Provides hooks (useState, useEffect, useRef) for managing component state and lifecycle, enabling efficient rendering and reusable UI components across the application.

- **Vite 7.1.9**: A modern build tool and development server that provides lightning-fast Hot Module Replacement (HMR) during development. It compiles code on-demand for faster startup times and optimizes production builds with code splitting and tree-shaking.

- **React DOM 18.3.1**: The bridge between React components and the actual DOM. Handles rendering React components to the browser, managing updates efficiently through virtual DOM diffing, and providing the createRoot API for concurrent rendering features.

##### Styling & Design
- **TailwindCSS 3.4.10**: A utility-first CSS framework that provides pre-built classes for rapid UI development. Enables responsive design, custom themes, and consistent styling across components without writing custom CSS files.

- **@tailwindcss/typography 0.5.17**: A Tailwind plugin that provides beautiful typography defaults for prose content. Used specifically for rendering blog content with proper styling for headings, paragraphs, lists, code blocks, and blockquotes without manual CSS.

- **PostCSS 8.4.41**: A tool for transforming CSS with JavaScript plugins. Works with Tailwind to process utility classes, add vendor prefixes for browser compatibility, and optimize the final CSS output by removing unused styles.

- **Autoprefixer 10.4.20**: A PostCSS plugin that automatically adds vendor prefixes (-webkit-, -moz-, -ms-) to CSS rules based on browser compatibility data, ensuring consistent appearance across different browsers without manual prefix writing.

##### Routing & Navigation
- **React Router DOM 6.26.1**: A declarative routing library for React that enables single-page application (SPA) navigation without full page reloads. Provides components like BrowserRouter, Routes, Route, Link, and NavLink for managing navigation state, URL parameters, and protected routes based on authentication status.

##### State Management
- **Redux Toolkit 2.2.7**: The official, opinionated Redux toolset that simplifies Redux development by providing utilities like createSlice, configureStore, and built-in Immer for immutable state updates. Reduces boilerplate code while maintaining predictable state management across the application.

- **React Redux 9.1.2**: The official React bindings for Redux that connect React components to the Redux store. Provides hooks like useSelector (read state) and useDispatch (dispatch actions) for accessing global state without prop drilling through component trees.

##### HTTP Communication
- **Axios 1.7.4**: A promise-based HTTP client for making API requests to the backend. Provides features like request/response interceptors (used for automatically adding JWT tokens to headers), request cancellation, timeout handling, and automatic JSON transformation. Simplifies error handling and supports both browser and Node.js environments.

##### Rich Text Editing
- **@tiptap/react 3.4.4**: A headless, framework-agnostic rich text editor that provides the React wrapper and core functionality. Offers a modern alternative to traditional WYSIWYG editors with full control over the UI and rendering logic.

- **@tiptap/starter-kit 3.4.4**: A collection of essential TipTap extensions bundled together including Bold, Italic, Headings, Paragraph, Lists, Code blocks, and more. Provides the basic text formatting features needed for blog content creation without importing extensions individually.

- **@tiptap/extension-link 3.4.4**: Adds hyperlink functionality to the editor. Allows users to create, edit, and remove links in blog content with customizable options like target attributes and link validation.

- **@tiptap/extension-image 3.4.4**: Enables image insertion and manipulation within the editor. Integrates with the Cloudinary upload system to embed images directly into blog posts with customizable CSS classes for styling (rounded corners, max height, ring borders).

- **@tiptap/extension-placeholder 3.4.4**: Displays a customizable placeholder text ("Write your story...") when the editor is empty. Improves user experience by providing visual guidance on where to start typing.

##### Icon Libraries
- **Lucide React 0.475.0**: A modern icon library providing clean, consistent SVG icons as React components. Used for UI elements like ArrowRight, Monitor, Search, Globe, ChevronDown in the Home page and other components. Icons are tree-shakable, meaning only imported icons are included in the bundle.

- **React Icons 5.3.0**: A comprehensive icon library that includes popular icon sets (Font Awesome, Material Design, etc.) as React components. Provides thousands of icons with consistent API (className, size, color props) for various UI needs like FaBars (menu), FaSearch (search icon) in the navigation header.

##### User Feedback & Notifications
- **React Hot Toast 2.4.1**: A lightweight, customizable toast notification library for displaying success, error, and info messages. Provides smooth animations, auto-dismiss functionality, and theming options. Used throughout the app for showing feedback on actions like login success, post creation, follow/unfollow confirmations, and error messages.

##### Markdown Processing
- **Marked 15.0.12**: A fast Markdown parser and compiler that converts Markdown syntax to HTML. Used when loading existing blog posts - converts stored Markdown content into HTML for the TipTap editor to display and edit. Supports GitHub Flavored Markdown (GFM) extensions.

- **Turndown 7.2.1**: A JavaScript library that converts HTML back to Markdown. Used in the editor's onUpdate callback - when users edit content in the WYSIWYG editor, it converts the HTML output to Markdown format for storage in the database. This ensures content is stored in a portable, lightweight format.

- **React Markdown 9.0.3**: A React component for rendering Markdown content as React elements. Provides safe HTML rendering with XSS protection, syntax highlighting support, and customizable component mapping for different Markdown elements.

##### HTML Parsing
- **HTML React Parser 5.2.2**: Converts HTML strings into React elements safely. Used for rendering blog content that contains HTML tags, ensuring proper React component tree structure and preventing XSS attacks by sanitizing dangerous HTML. Allows custom component replacements for specific HTML tags.

##### Utilities
- **UUID 11.0.5**: Generates RFC4122 compliant Universally Unique Identifiers. Used for creating unique keys for dynamically rendered list items in React (when database IDs aren't available) and for generating unique identifiers for temporary data before server persistence.

##### Code Quality & Development Tools
- **ESLint 9.9.0**: A JavaScript linter that analyzes code for potential errors, bugs, and style inconsistencies. Enforces code quality standards with plugins for React-specific rules (react-hooks, react-refresh) ensuring best practices like proper hook usage and preventing common mistakes.

- **Prettier 3.3.3**: An opinionated code formatter that enforces consistent code style across the project. Automatically formats code on save, handling indentation, line breaks, quotes, and semicolons to maintain readable and uniform code.

- **prettier-plugin-tailwindcss 0.6.8**: A Prettier plugin that automatically sorts Tailwind CSS classes in a consistent, recommended order. Improves code readability and prevents merge conflicts by standardizing class ordering (layout → spacing → sizing → colors → effects).

##### TypeScript Support (Development)
- **@types/react 18.3.3**: TypeScript type definitions for React. Provides autocomplete, type checking, and IntelliSense in IDEs even when using JavaScript, improving developer experience and catching potential errors during development.

- **@types/react-dom 18.3.0**: TypeScript type definitions for React DOM. Complements React types by providing type information for DOM-specific React APIs and components.

##### Build Plugins
- **@vitejs/plugin-react 4.3.1**: Official Vite plugin that adds React support including Fast Refresh (hot reloading), JSX transformation, and automatic React import injection. Enables near-instant updates during development when changing component code without losing component state.

#### **Backend (Server)**
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17 (compiled with Java 17 source/target)
- **Database**: MongoDB (Cloud - MongoDB Atlas)
- **Security**: Spring Security 6.x with JWT Authentication
- **Email**: Spring Mail (SMTP via Gmail)
- **Image Storage**: Cloudinary
- **Build Tool**: Maven 3.9.11
- **Key Dependencies**:
  - Spring Data MongoDB
  - Spring Boot Starter Web
  - Spring Boot Starter Security
  - Spring Boot Starter Mail
  - Spring Boot Starter Validation
  - JWT (io.jsonwebtoken:jjwt 0.12.6)
  - Cloudinary HTTP44 1.34.0

---

## 📊 Database Schema (MongoDB Collections)

### 1. **users** Collection
```java
{
  _id: ObjectId,
  name: String,
  userName: String (unique, indexed),
  email: String,
  password: String (BCrypt hashed),
  gender: String,
  avtar: String (Cloudinary URL),
  resetToken: String,
  resetTokenExpiration: LocalDateTime,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime,
  lastVerifiedAt: LocalDateTime,
  isActive: Boolean
}
```

### 2. **blogs** Collection
```java
{
  _id: ObjectId (blogId),
  title: String,
  slug: String,
  featureImage: String (Cloudinary URL),
  content: String (Markdown format),
  visits: Long (view count),
  userId: ObjectId (author reference),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### 3. **comment** Collection
```java
{
  _id: ObjectId (commentId),
  userId: ObjectId (commenter reference),
  blogId: ObjectId (blog reference),
  content: String,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### 4. **likes** Collection
```java
{
  _id: ObjectId (likeId),
  userId: ObjectId (user who liked),
  blogId: ObjectId (liked blog),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### 5. **follows** Collection
```java
{
  _id: ObjectId (followId),
  followerId: ObjectId (user who follows),
  followingId: ObjectId (user being followed),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### 6. **otp_details** Collection
```java
{
  _id: ObjectId,
  email: String,
  otp: String,
  localTime: LocalTime (expiry tracking)
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Registration**:
   - User registers with name, username, email, password
   - OTP sent to email (5-minute validity)
   - User verifies OTP
   - JWT token generated and returned

2. **Login**:
   - User provides email and password
   - BCrypt password verification
   - JWT token generated with userId as subject
   - Token stored in localStorage (client-side)

3. **Token Management**:
   - **JWT Secret**: Configured in application.properties
   - **Token Storage**: localStorage (authToken, userId, userData)
   - **Token Transmission**: Authorization header (`Bearer <token>`)
   - **Token Validation**: JWTFilter intercepts all requests

### Security Configuration
- **Public Endpoints**: `/public/**` (no authentication required)
- **Protected Endpoints**: `/blog/**`, `/user/**`, `/like/**`, `/follow/**`
- **CORS**: Enabled for localhost development (all ports)
- **CSRF**: Disabled (stateless JWT authentication)
- **Password Encoding**: BCryptPasswordEncoder

### JWT Filter Process
```
Request → JWTFilter → Extract Token (Header/Cookie) 
→ Validate Token → Load UserDetails → Set SecurityContext 
→ Continue to Controller
```

---

## 🔄 Frontend State Management

### Redux Store Structure
```javascript
{
  auth: {
    isLoggedIn: boolean,
    data: {
      id, name, userName, email, gender, avtar, ...
    },
    token: string (JWT),
    userId: string
  }
}
```

### Actions
- **login**: Stores user data, token, and userId
- **logout**: Clears all auth data from state and localStorage

### Persistence
- State synced with localStorage
- On app load, checks for `authToken` in localStorage
- If token exists, calls `/user/me` to verify and restore session

---

## 🛣️ API Routes

### Public Routes (No Auth Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/public/signup` | User registration |
| POST | `/public/login` | User login / Resend OTP |
| POST | `/public/otp-verification` | Verify OTP |
| GET | `/public/get-user/:userName` | Get user profile |
| GET | `/public/get-all-blog-posts` | Get all blogs |
| GET | `/public/get-blog-post/:blogId` | Get single blog |
| GET | `/public/:blogId/get-blog-comments` | Get blog comments |
| GET | `/public/user/:userName/get-user-post` | Get user's blogs |
| GET | `/public/get-blog-search/:query` | Search blogs |

### Protected Routes (Auth Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/user/me` | Get current user |
| PUT | `/user/update-profile` | Update user profile |
| PUT | `/user/update-profile-pic` | Update avatar |
| PUT | `/user/change-password` | Change password |
| POST | `/user/logout` | Logout user |
| POST | `/blog/create` | Create blog post |
| POST | `/blog/edit/:blogId` | Edit blog post |
| DELETE | `/blog/:blogId` | Delete blog post |
| POST | `/comment/:blogId/create-comment` | Create comment |
| POST | `/like/:blogId/like-blog-post` | Like blog |
| DELETE | `/like/:blogId/unlike-blog-post` | Unlike blog |
| POST | `/follow/:userName/follow-user` | Follow user |
| DELETE | `/follow/:userName/unfollow-user` | Unfollow user |
| POST | `/upload` | Upload image to Cloudinary |

---

## 📄 Frontend Pages & Components

### Pages
1. **Home** - Landing page with features, stats, FAQ
2. **Login** - User login form
3. **Register** - User registration form
4. **VerifyOtp** - OTP verification page
5. **Blogs** - List all blog posts
6. **Blog** - Single blog post view with comments
7. **CreateBlog** - Rich text editor for new blog
8. **EditPost** - Edit existing blog post
9. **Profile** - User profile with posts, followers, following
10. **EditUser** - Edit user profile, change password, update avatar
11. **Search** - Search blogs by query

### Key Components
- **Header** - Navigation with auth status
- **Editor** - TipTap WYSIWYG editor with Markdown conversion
- **BlogCard** - Blog preview card
- **BlogPost** - Full blog display with rich formatting
- **Comment/CommentCard** - Comment display
- **FollowBtn** - Follow/unfollow button
- **LikeBtn** - Like/unlike button
- **ThemedToaster** - Toast notifications
- **Loader** - Loading spinner
- **UpdateAvatar** - Avatar upload component
- **ChangePassword** - Password change form

---

## ✨ Key Features

### 1. **Blog Management**
- Create blog posts with rich text editor (TipTap)
- Support for headings, lists, code blocks, blockquotes
- Image upload to Cloudinary
- Edit and delete own posts
- Markdown storage, HTML rendering
- Slug generation for SEO-friendly URLs
- Visit/view tracking

### 2. **User Authentication**
- Email/Password registration
- OTP verification via email (5-minute expiry)
- Resend OTP functionality
- JWT-based session management
- Persistent login (localStorage)
- Automatic token refresh on page reload
- Secure password hashing (BCrypt)

### 3. **Social Features**
- **Follow System**: Follow/unfollow users
- **Like System**: Like/unlike blog posts
- **Comment System**: Comment on blogs
- **User Profiles**: View followers, following, posts count
- **Activity Tracking**: See who you're following

### 4. **Search & Discovery**
- Search blogs by query
- View all published blogs
- User-specific blog listings
- Recent posts display

### 5. **Media Management**
- Image upload for blog content
- Avatar upload for user profiles
- Cloudinary integration for image storage
- Automatic image optimization

---

## 🔧 Configuration

### Environment Variables (Client)
```
VITE_SERVER_URL=http://localhost:8080
```

### Application Properties (Server)
```properties
# MongoDB
spring.data.mongodb.uri=mongodb+srv://...
spring.data.mongodb.database=bloghivedb

# JWT
jwt.secret=TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V

# Email (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=jropox7272@gmail.com
spring.mail.password=*** (app password)

# Cloudinary
cloudinary.cloud_name=dpw1lvfiw
cloudinary.api_key=126213724992293
cloudinary.api_secret=***

# Server
server.port=8080
```

---

## 🚀 Deployment & Build

### Frontend Build
```bash
cd client
npm install
npm run dev     # Development
npm run build   # Production build
```

### Backend Build
```bash
cd server
mvn clean install
mvn spring-boot:run
```

---

## 🐛 Known Issues (From Code Comments)
1. ~~Response structure needs standardization~~ (Resolved with ApiResponse wrapper)
2. ~~Error in follow module~~ (Fixed with followerId/followingId naming)

---

## 🔒 Security Measures
1. **Password Security**: BCrypt hashing
2. **JWT Tokens**: Secure token-based authentication
3. **CORS Configuration**: Controlled cross-origin access
4. **Input Validation**: Spring Validation annotations
5. **Email Verification**: OTP-based account activation
6. **Protected Routes**: Role-based access control

---

## 📱 User Experience Features
- Responsive design (mobile-friendly)
- Toast notifications for user feedback
- Loading states
- Error boundaries
- Smooth animations
- Dark mode support (via Tailwind)
- SEO-friendly URLs (slugs)

---

## 🎨 UI/UX Design Patterns
- **Card-based layouts** for content display
- **Gradient backgrounds** for hero sections
- **Hover effects** on interactive elements
- **Modal dialogs** for forms
- **Skeleton loaders** during data fetch
- **Sticky navigation** header
- **Floating action buttons** for quick actions

---

## 📦 Data Flow

### Blog Creation Flow
```
User writes in TipTap Editor 
→ HTML converted to Markdown (Turndown)
→ POST /blog/create with Markdown content
→ Server stores in MongoDB
→ Returns blog ID and data
→ Navigate to new blog page
```

### Authentication Flow
```
User enters credentials
→ POST /public/login
→ Server validates credentials
→ JWT token generated
→ Token + user data returned
→ Redux stores in state
→ localStorage persists data
→ All API calls include Bearer token
```

### Like/Follow Flow
```
User clicks Like/Follow button
→ POST request to backend
→ Backend checks if already liked/followed
→ Creates/deletes record in collection
→ Returns updated status
→ UI updates button state
→ Count incremented/decremented
```

---

## 🧩 Code Organization

### Backend Structure
```
backend/
├── configuration/      # Security, beans config
├── controller/         # REST endpoints
│   ├── blog/
│   ├── comment/
│   ├── follow/
│   ├── like/
│   ├── upload/
│   └── user/
├── DTOs/              # Data Transfer Objects
│   ├── request/
│   └── response/
├── filter/            # JWT authentication filter
├── model/             # MongoDB entities
│   ├── blog/
│   ├── comment/
│   ├── follow/
│   ├── like/
│   └── user/
├── repository/        # MongoDB repositories
├── service/           # Service interfaces
├── serviceImpl/       # Service implementations
└── utils/             # JWT utilities, helpers
```

### Frontend Structure
```
client/
├── src/
│   ├── api/           # Axios configuration & API calls
│   ├── components/    # Reusable UI components
│   ├── features/      # Redux slices
│   │   └── auth/
│   ├── pages/         # Route pages
│   ├── store/         # Redux store config
│   └── utils/         # Helper functions
├── public/            # Static assets
└── index.html         # Entry point
```

---

## 🎯 Design Decisions

### Why MongoDB?
- **Schema flexibility** for evolving blog structure
- **Fast reads** for blog listing
- **Embedded documents** for nested data
- **Cloud-native** with MongoDB Atlas

### Why JWT?
- **Stateless authentication** (scalable)
- **Cross-domain support**
- **Mobile-friendly** (no cookies required)
- **Payload flexibility** (store user ID)

### Why TipTap?
- **Headless** (full UI control)
- **Markdown support** (storage optimization)
- **Extensible** (custom plugins)
- **Modern** (React-first design)

### Why Redux Toolkit?
- **Simplified boilerplate** (less code)
- **Immer integration** (immutable updates)
- **DevTools support** (debugging)
- **TypeScript ready** (future-proof)

---

## 🔮 Potential Improvements

1. **Email Notifications**: Notify on new followers/comments
2. **Draft System**: Save posts as drafts
3. **Categories/Tags**: Organize blogs by topics
4. **Rich User Profiles**: Bio, social links, cover image
5. **Pagination**: For blog lists
6. **Infinite Scroll**: Better UX for long lists
7. **Real-time Updates**: WebSocket for live notifications
8. **Bookmarks**: Save favorite blogs
9. **Share Features**: Social media integration
10. **Analytics Dashboard**: View stats, engagement metrics
11. **Dark Mode Toggle**: User preference
12. **Password Reset**: Forgot password flow
13. **Email Templates**: Professional OTP emails
14. **Rate Limiting**: Prevent spam/abuse
15. **Image Compression**: Optimize upload size

---

## 📝 Notes
- **Java Version**: Project configured for Java 21 but compiles to Java 17 bytecode due to JDK 17 being used by Maven
- **API Response**: All endpoints return standardized `ApiResponse<T>` wrapper with statusCode, message, data
- **Token Expiry**: JWT tokens don't have explicit expiry configured (should be added)
- **OTP Expiry**: 5 minutes (validation logic based on LocalTime comparison)
- **Image Limits**: No file size validation on uploads (should be added)
- **Error Handling**: Basic try-catch, could use global exception handler

---

## 🏁 Conclusion

BlogHive is a modern, full-featured blogging platform built with industry-standard technologies. It demonstrates:
- Full-stack development skills (React + Spring Boot)
- RESTful API design
- JWT authentication implementation
- MongoDB schema design
- Cloud integration (Cloudinary, MongoDB Atlas)
- Modern frontend practices (hooks, Redux, routing)
- Security best practices
- Rich text editing capabilities

The codebase is well-structured, modular, and follows MVC pattern on the backend and component-based architecture on the frontend.
