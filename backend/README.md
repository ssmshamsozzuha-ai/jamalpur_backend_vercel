# Backend API - Jamalpur Chamber

Express.js REST API with MongoDB

## 🚀 Setup

```bash
npm install
```

## ⚙️ Configuration

Create `.env` file:

```env
BREVO_API_KEY=your-brevo-api-key
MONGODB_URI=mongodb://localhost:27017/jamalpur-chamber
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 📦 Run

```bash
# Development
npm start

# Production
NODE_ENV=production npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Notices (Admin)
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Gallery (Admin)
- `GET /api/gallery` - Get all images
- `POST /api/gallery/upload` - Upload image
- `DELETE /api/gallery/:id` - Delete image

### Forms
- `POST /api/forms/submit-with-file` - Submit form with PDF
- `GET /api/forms/submissions` - Get submissions (Admin)

### News (Admin)
- `GET /api/news` - Get all news
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

## 🔒 Default Admin

```
Email: admin@admin.com
Password: admin123
```

## 📊 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- multer - File uploads
- nodemailer - Email sending
- cors - CORS middleware
- dotenv - Environment variables
- compression - Response compression


