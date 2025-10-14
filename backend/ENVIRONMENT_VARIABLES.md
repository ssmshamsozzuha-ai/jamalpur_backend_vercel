# Environment Variables for Vercel Deployment

## Required Environment Variables

Set these in your Vercel project dashboard under Settings → Environment Variables:

### Database Configuration
```
MONGODB_URI=mongodb+srv://jamalpur_backend:twZvaevHCQmlpXfg@jamalpur-cluster.lerdqph.mongodb.net/?retryWrites=true&w=majority&appName=jamalpur-cluster
```

### JWT Configuration
```
JWT_SECRET=jamalpur-chamber-super-secret-jwt-key-2024-production
```

### Server Configuration
```
NODE_ENV=production
CLIENT_URL=https://jamalpur-frontend3.vercel.app
FRONTEND_URL=https://jamalpur-frontend3.vercel.app
```

### Email Configuration
```
BREVO_API_KEY=xkeys-your-brevo-api-key-here
```

### File Upload Configuration
```
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### Security Configuration
```
BCRYPT_ROUNDS=10
JWT_EXPIRES_IN=24h
OTP_EXPIRES_IN=600000
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to set them for "Production" environment
6. Redeploy your project after adding variables

## Important Notes

- **Never commit these values to version control**
- **Use strong, unique values for JWT_SECRET**
- **Test your MongoDB connection before deploying**
- **Set up Brevo email service for password reset functionality**
