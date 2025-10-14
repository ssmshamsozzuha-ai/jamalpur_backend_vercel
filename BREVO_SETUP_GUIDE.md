# 📧 Brevo Email Setup Guide

## 🌟 Why Brevo?

- **300 emails/day FREE** (vs SendGrid's 100/day)
- **High deliverability** rates
- **Easy setup** with REST API
- **EU-based** and GDPR compliant
- **No credit card required** for free tier

## 🚀 Step-by-Step Setup

### 1. Create Brevo Account

1. Go to [Brevo.com](https://www.brevo.com/)
2. Click "Sign up for free"
3. Use your email: `smshamsozzuhas@gmail.com`
4. Verify your email address

### 2. Get Your API Key

1. **Login to Brevo Dashboard**
2. **Go to Settings** → **API Keys**
3. **Click "Create New API Key"**
4. **Name it**: "Jamalpur Chamber Password Reset"
5. **Select permissions**: "Send emails" (or Full Access)
6. **Copy the API key** (starts with `xkeys-`)

### 3. Configure Environment Variables

#### For Local Development:
Create `.env` file in your `backend` folder:
```env
BREVO_API_KEY=xkeys-your-api-key-here
CLIENT_URL=http://localhost:3000
```

#### For Production (Render):
1. Go to your Render dashboard
2. Select your backend service
3. Go to Environment tab
4. Add these variables:
```env
BREVO_API_KEY=xkeys-your-api-key-here
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### 4. Test the Setup

Run the test script:
```bash
cd backend
node test-email.js
```

You should see:
```
📊 Email Service Status: { brevo: true, sendGrid: undefined, gmail: undefined, twilio: undefined }
✅ Reset email sent via Brevo
```

## 🔧 Email Priority Order

Your system will try email services in this order:

1. **Brevo** (Highest Priority) - 300 emails/day free
2. **SendGrid** (Fallback) - 100 emails/day free  
3. **Gmail SMTP** (Last Resort) - Limited by Google

## 📧 Email Configuration

The system is configured to send emails from:
- **From Name**: "Jamalpur Chamber of Commerce"
- **From Email**: "smshamsozzuhas@gmail.com"
- **Subject**: "Password Reset Link - Jamalpur Chamber of Commerce & Industry"

## 🧪 Testing

### Test Password Reset:
1. Go to your frontend
2. Click "Forgot Password"
3. Enter any email address
4. Check if you receive the email

### Test API Status:
```bash
curl http://localhost:5000/api/services/status
```

Should return:
```json
{
  "emailServices": {
    "brevo": true,
    "sendGrid": false,
    "gmail": false,
    "twilio": false
  },
  "message": "Service status retrieved successfully"
}
```

## 🚨 Troubleshooting

### Issue: "Brevo API error: 401"
**Solution**: Check your API key is correct and has proper permissions

### Issue: "Brevo API error: 400"
**Solution**: Verify the sender email is verified in Brevo

### Issue: Emails not received
**Solutions**:
1. Check spam folder
2. Verify sender email in Brevo dashboard
3. Check Brevo sending limits

## 📊 Brevo Dashboard

Monitor your email sending:
1. **Login to Brevo**
2. **Go to Statistics** → **Email**
3. **View delivery rates and bounces**

## 🎯 Benefits for Your Project

- ✅ **Reliable delivery** to inbox (not spam)
- ✅ **Professional appearance** with your branding
- ✅ **300 emails/day free** (perfect for your use case)
- ✅ **Easy integration** with your existing system
- ✅ **Fallback options** if Brevo fails

## 🔒 Security

- API keys are stored securely in environment variables
- Emails are sent over HTTPS
- Tokens expire in 1 hour for security
- No sensitive data in email content

---

**Ready to test?** Set up your Brevo API key and run the test script!
