# Vercel Backend Deployment Guide

This guide will help you deploy your Jamalpur Chamber of Commerce backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **MongoDB Atlas**: Set up a cloud MongoDB database
4. **Environment Variables**: Prepare your production environment variables

## Step 1: Prepare Your Environment Variables

Create a `.env.production` file in your backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://jamalpur:4hwq02K1y0cc811Y@jamalpur-cluster.pmjnmjc.mongodb.net/Jamalpur-chamber?retryWrites=true&w=majority&appName=jamalpur-cluster

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
NODE_ENV=production
CLIENT_URL=https://jamalpur-frontend3.vercel.app

# Email Configuration
BREVO_API_KEY=xkeys-your-brevo-api-key-here

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Security Configuration
BCRYPT_ROUNDS=10
JWT_EXPIRES_IN=24h
OTP_EXPIRES_IN=600000
```

## Step 2: Install Vercel CLI and Login

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login
```

## Step 3: Deploy to Vercel

Navigate to your backend directory and deploy:

```bash
cd backend

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: jamalpur-chamber-backend
# - Directory: ./
# - Override settings? No
```

## Step 4: Set Environment Variables in Vercel Dashboard

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each environment variable from your `.env.production` file

**Important Environment Variables to Set:**
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CLIENT_URL`
- `BREVO_API_KEY` (or your chosen email service)
- Any other service-specific keys

## Step 5: Redeploy with Environment Variables

After setting environment variables, redeploy:

```bash
vercel --prod
```

## Step 6: Test Your Deployment

1. Check the health endpoint: `https://your-project.vercel.app/api/health`
2. Test authentication: `https://your-project.vercel.app/api/auth/login`
3. Verify database connection by creating a test user

## Step 7: Update Frontend Configuration

Update your frontend's API configuration to point to your Vercel backend:

```javascript
// In your frontend environment variables
REACT_APP_API_URL=https://your-backend-project.vercel.app/api
REACT_APP_SOCKET_URL=https://your-backend-project.vercel.app
```

## Important Notes for Vercel Deployment

### 1. Serverless Limitations
- **File Uploads**: Vercel has limitations with file uploads in serverless functions
- **Socket.IO**: WebSocket connections may not work as expected in serverless environment
- **File Storage**: Consider using cloud storage (AWS S3, Cloudinary) for file uploads

### 2. Database Connection
- Use MongoDB Atlas for cloud database
- Ensure your MongoDB connection string includes proper authentication
- Set up proper IP whitelisting in MongoDB Atlas
- Configure Brevo email service for password reset functionality

### 3. Environment Variables
- Never commit `.env` files to version control
- Use Vercel's environment variable system for production secrets
- Test environment variables in Vercel dashboard

### 4. Performance Considerations
- Vercel functions have a 30-second timeout limit
- Consider optimizing database queries
- Use caching where appropriate

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check your MongoDB Atlas connection string
   - Ensure IP whitelisting includes Vercel's IP ranges
   - Verify database credentials

2. **Environment Variables Not Working**
   - Check Vercel dashboard environment variables
   - Redeploy after adding new variables
   - Ensure variable names match exactly

3. **File Upload Issues**
   - Vercel serverless functions have limited file system access
   - Consider using cloud storage services
   - Use `/tmp` directory for temporary files

4. **Socket.IO Not Working**
   - WebSocket connections may not work in serverless environment
   - Consider using Vercel's real-time features or external WebSocket service

## Production Checklist

- [ ] MongoDB Atlas database configured
- [ ] Environment variables set in Vercel
- [ ] Email service configured (Brevo)
- [ ] JWT secret is secure and unique
- [ ] Frontend API URLs updated
- [ ] Health endpoint responding
- [ ] Authentication working
- [ ] Database operations working
- [ ] File uploads working (if applicable)
- [ ] Error handling in place

## Monitoring and Maintenance

1. **Vercel Dashboard**: Monitor function invocations and errors
2. **MongoDB Atlas**: Monitor database performance and connections
3. **Logs**: Check Vercel function logs for errors
4. **Uptime**: Set up monitoring for your API endpoints

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Review error messages in browser console
5. Check MongoDB Atlas logs

Your backend should now be successfully deployed to Vercel! 🚀
