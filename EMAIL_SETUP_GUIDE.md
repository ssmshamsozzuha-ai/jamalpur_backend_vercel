# 📧 Email Setup Guide for Password Reset

## 🔍 **Why You're Seeing URLs Instead of Emails**

The password reset is showing URLs instead of sending emails because **no email service is configured**. The system is designed to fallback gracefully by showing the reset URL when email fails.

## 🛠️ **How to Fix This**

### **Step 1: Create Environment File**
Create a `.env` file in the `backend` directory with your email service credentials.

### **Step 2: Choose an Email Service**

#### **Option 1: Brevo (Recommended - FREE)**
1. Go to [Brevo.com](https://www.brevo.com) and create a free account
2. Get your API key from Settings > API Keys
3. Add to `.env`:
```env
BREVO_API_KEY=xkeys-your-brevo-api-key-here
```

#### **Option 2: Gmail SMTP (Easy Setup)**
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password: Google Account > Security > App passwords
3. Add to `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

#### **Option 3: SendGrid (Professional)**
1. Create account at [SendGrid.com](https://sendgrid.com)
2. Get API key from Settings > API Keys
3. Add to `.env`:
```env
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### **Step 3: Restart Backend Server**
After adding email credentials, restart your backend server:
```bash
cd backend
npm start
```

## 🧪 **Test Email Configuration**

Run the email test script:
```bash
cd backend
node test-email.js
```

## 📋 **Complete .env Template**

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jamalpur-chamber?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email Configuration (Choose ONE option below)

# Option 1: Brevo (Recommended - 300 emails/day free)
BREVO_API_KEY=xkeys-your-brevo-api-key-here

# Option 2: SendGrid (Alternative)
# SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Option 3: Gmail SMTP (Fallback)
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-gmail-app-password

# Twilio SMS (Alternative Method)
# TWILIO_ACCOUNT_SID=your-twilio-account-sid
# TWILIO_AUTH_TOKEN=your-twilio-auth-token
# TWILIO_PHONE_NUMBER=+1234567890

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Security Configuration
BCRYPT_ROUNDS=10
JWT_EXPIRES_IN=24h
OTP_EXPIRES_IN=600000
```

## ✅ **After Setup**

Once configured, password reset will:
1. ✅ Send email with reset link
2. ✅ User clicks link in email
3. ✅ Redirects to reset password page
4. ✅ User sets new password
5. ✅ Redirects to login

## 🔒 **Security Features**

- Reset tokens expire in 1 hour
- Tokens are cryptographically secure
- Multiple email service fallbacks
- Graceful degradation (shows URL if email fails)

## 🆘 **Need Help?**

If you're still having issues:
1. Check the backend console for error messages
2. Verify your email service credentials
3. Test with the `test-email.js` script
4. Check your spam folder for emails
