// Vercel serverless function entry point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamalpur:4hwq02K1y0cc811Y@jamalpur-cluster.pmjnmjc.mongodb.net/Jamalpur-chamber?retryWrites=true&w=majority&appName=jamalpur-cluster';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ createdAt: -1 });

const formSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, default: 'general' },
  address: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now }
});

formSubmissionSchema.index({ submittedAt: -1 });
formSubmissionSchema.index({ email: 1 });

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  priority: { type: String, enum: ['high', 'normal', 'low'], default: 'normal' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ isActive: 1 });

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  altText: { type: String, required: true },
  category: { type: String, enum: ['meeting', 'event', 'conference'], default: 'meeting' },
  isActive: { type: Boolean, default: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['business', 'policy', 'event', 'announcement'], default: 'business' },
  author: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ isActive: 1 });
newsSchema.index({ isFeatured: 1 });

// Models
const User = mongoose.model('User', userSchema);
const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);
const Notice = mongoose.model('Notice', noticeSchema);
const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
const News = mongoose.model('News', newsSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// API Routes

app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      message: 'THE JAMALPUR CHAMBER OF COMMERCE AND INDUSTRY API is running!',
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'Vercel' : 'Local',
      database: {
        status: dbStatus,
        readyState: dbState
      },
      environment_variables: {
        mongodb_uri: process.env.MONGODB_URI ? 'set' : 'not set',
        jwt_secret: process.env.JWT_SECRET ? 'set' : 'not set',
        node_env: process.env.NODE_ENV || 'not set'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { name: req.body.name, email: req.body.email });
    
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Checking for existing user with email:', normalizedEmail);

    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: normalizedEmail, password: hashedPassword });
    await user.save();
    console.log('User created successfully:', user._id);

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Registration successful');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Form Submission
app.post('/api/forms/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const submission = new FormSubmission({
      name,
      email,
      phone,
      message
    });

    await submission.save();

    res.status(201).json({
      message: 'Form submitted successfully',
      submission: {
        id: submission._id,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
        submittedAt: submission.submittedAt
      }
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ message: 'Server error during form submission' });
  }
});

// Get notices - TEMPORARILY DISABLED DUE TO MONGODB CONNECTION ISSUES
app.get('/api/notices', async (req, res) => {
  console.log('🚫 Notices API temporarily disabled - MongoDB connection issues');
  res.status(503).json({ 
    message: 'Notices temporarily unavailable - MongoDB connection issues',
    error: 'Service temporarily unavailable'
  });
});

// Create Notice (Admin only)
app.post('/api/notices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const notice = new Notice({
      title: title.trim(),
      content: content.trim(),
      priority: priority || 'normal',
      author: req.user.name || 'Admin'
    });

    await notice.save();

    res.status(201).json({
      message: 'Notice created successfully',
      notice: {
        id: notice._id,
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
        author: notice.author,
        createdAt: notice.createdAt
      }
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ message: 'Server error creating notice' });
  }
});

// Get gallery - TEMPORARILY DISABLED DUE TO MONGODB CONNECTION ISSUES
app.get('/api/gallery', async (req, res) => {
  console.log('🚫 Gallery API temporarily disabled - MongoDB connection issues');
  res.status(503).json({ 
    message: 'Gallery temporarily unavailable - MongoDB connection issues',
    error: 'Service temporarily unavailable'
  });
});

// Get news - TEMPORARILY DISABLED DUE TO MONGODB CONNECTION ISSUES
app.get('/api/news', async (req, res) => {
  console.log('🚫 News API temporarily disabled - MongoDB connection issues');
  res.status(503).json({ 
    message: 'News temporarily unavailable - MongoDB connection issues',
    error: 'Service temporarily unavailable'
  });
});

// Create news article (Admin only)
app.post('/api/news', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, category, imageUrl, isFeatured } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    if (title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }
    
    if (content.trim().length < 10) {
      return res.status(400).json({ message: 'Content must be at least 10 characters long' });
    }

    const news = new News({
      title: title.trim(),
      content: content.trim(),
      category: category || 'business',
      author: req.user.name || 'Admin',
      imageUrl: imageUrl || '',
      isFeatured: isFeatured || false
    });

    await news.save();
    
    res.status(201).json({
      message: 'News article created successfully',
      news: {
        id: news._id,
        title: news.title,
        content: news.content,
        category: news.category,
        author: news.author,
        imageUrl: news.imageUrl,
        isFeatured: news.isFeatured,
        publishedAt: news.publishedAt
      }
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Server error creating news' });
  }
});

// Initialize default admin user
const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created: admin@admin.com / admin123');
    } else {
      console.log('✅ Admin user already exists: admin@admin.com');
    }
  } catch (error) {
    console.error('❌ Error creating/resetting admin:', error);
  }
};

// Initialize admin on startup
initializeDefaultAdmin();

// Default route to prevent 404 errors
app.get('/', (req, res) => {
  res.json({
    message: 'Jamalpur Chamber of Commerce & Industry - Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      health: '/api/health',
      auth: '/api/auth',
      notices: '/api/notices',
      gallery: '/api/gallery',
      news: '/api/news',
      forms: '/api/forms'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response
});

// Debug endpoint to check environment variables
app.get('/api/debug', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'Vercel' : 'Local',
    node_env: process.env.NODE_ENV,
    mongodb_uri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    brevo_api_key: process.env.BREVO_API_KEY ? 'SET' : 'NOT SET',
    mongoose_connection_state: mongoose.connection.readyState,
    mongoose_connection_host: mongoose.connection.host || 'not connected'
  });
});

// Export the app for Vercel
module.exports = app;