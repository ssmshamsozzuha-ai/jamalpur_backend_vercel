const emailService = require('./server/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Service...\n');
  
  // Check service status
  const status = emailService.getServiceStatus();
  console.log('📊 Email Service Status:', status);
  
  if (!status.brevo) {
    console.log('❌ No email services configured!');
    console.log('\n🔧 To fix this, set the following environment variable:');
    console.log('   BREVO_API_KEY=your-brevo-api-key');
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