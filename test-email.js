const emailService = require('./server/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Service...\n');
  
  // Check service status
  const status = emailService.getServiceStatus();
  console.log('📊 Email Service Status:', status);
  
  if (!status.brevoSmtp && !status.brevo && !status.sendGrid && !status.gmail) {
    console.log('❌ No email services configured!');
    console.log('\n🔧 To fix this, set one of these environment variables:');
    console.log('   BREVO_SMTP_KEY=your-brevo-smtp-key (Recommended - 300 emails/day free)');
    console.log('   BREVO_API_KEY=your-brevo-api-key');
    console.log('   SENDGRID_API_KEY=your-sendgrid-key');
    console.log('   EMAIL_USER=your-gmail@gmail.com');
    console.log('   EMAIL_PASS=your-gmail-app-password');
    return;
  }
  
  // Test sending reset email
  const testEmail = 'test@example.com';
  const testUrl = 'http://localhost:3000/reset-password/test-token-123';
  const testName = 'Test User';
  
  console.log(`\n📧 Testing reset email to: ${testEmail}`);
  
  try {
    const result = await emailService.sendResetEmail(testEmail, testUrl, testName);
    console.log('✅ Email test result:', result);
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
  }
}

testEmail();