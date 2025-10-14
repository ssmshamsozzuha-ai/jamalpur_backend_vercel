# Jamalpur Chamber of Commerce & Industry

Modern web application for chamber management with authentication, notices, gallery, and form submissions.

## 📂 Project Structure

```
jamalpurCommerce_2/
├── backend/              # Express.js API
│   ├── server/
│   ├── package.json
│   └── .env
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
MONGODB_URI=mongodb://localhost:27017/jamalpur-chamber
JWT_SECRET=your-secret-key
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Run the Application

**Option A: Start separately**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

**Option B: Use the startup script (Windows)**
```bash
start-project.bat
```

## 🌐 Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## 🔑 Default Admin

```
Email: admin@admin.com
Password: admin123
```

## 📚 Documentation

- [Backend README](backend/README.md) - API documentation
- [Frontend README](frontend/README.md) - Frontend setup

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
```bash
cd backend
npm install
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm install
npm run build
```

## 🔧 Tech Stack

**Backend:** Express, MongoDB, JWT, Nodemailer, Multer  
**Frontend:** React, React Router, Axios, Framer Motion

## 📝 License

MIT License
