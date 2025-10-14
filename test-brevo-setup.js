const https = require('https');
require('dotenv').config();

async function testBrevoSetup() {
  console.log('🧪 Testing Brevo Email Configuration...\n');

  // Check if API key is set
  if (!process.env.BREVO_API_KEY) {
    console.log('❌ Missing Brevo API key in .env file');
    console.log('📝 Please add:');
    console.log('   BREVO_API_KEY=xkeys-your-brevo-api-key-here');
    console.log('\n🔗 Get your API key from: https://app.brevo.com/settings/keys/api');
    return;
  }

  console.log(`🔑 Brevo API Key: ${process.env.BREVO_API_KEY.substring(0, 10)}...`);
  console.log(`📧 From Email: smhamsozzuhas@gmail.com\n`);

  // Test email data
  const emailData = {
    sender: {
      name: "Jamalpur Chamber of Commerce",
      email: "smhamsozzuhas@gmail.com"
    },
    to: [
      {
        email: "smhamsozzuhas@gmail.com",
        name: "Test User"
      }
    ],
    subject: "🧪 Brevo Email Test - Jamalpur Chamber",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
          <h1 style="margin: 0;">✅ Brevo Email Test Successful!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Jamalpur Chamber of Commerce & Industry</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e40af; margin-top: 0;">Brevo Configuration Working!</h2>
          <p>Your Brevo email service is properly configured and ready to send password reset emails.</p>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #155724;"><strong>✅ What this means:</strong></p>
            <ul style="color: #155724; margin: 10px 0 0 20px;">
              <li>Password reset emails will be sent automatically</li>
              <li>Users will receive proper email notifications</li>
              <li>No more showing URLs on screen</li>
              <li>300 free emails per day with Brevo</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>📧 Next Steps:</strong></p>
            <ol style="color: #856404; margin: 10px 0 0 20px;">
              <li>Restart your backend server</li>
              <li>Test password reset functionality</li>
              <li>Users will now receive emails instead of URLs</li>
            </ol>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            <strong>Brevo Email Service</strong> - Reliable, fast, and free!
          </p>
        </div>
      </div>
    `
  };

  // Send request to Brevo API
  const postData = JSON.stringify(emailData);
  
  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'api-key': process.env.BREVO_API_KEY
    }
  };

  console.log('🔌 Testing Brevo API connection...');
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ Brevo API connection successful!');
        console.log('📤 Test email sent successfully!');
        console.log(`📧 Check your inbox: smhamsozzuhas@gmail.com\n`);
        console.log('🎉 Brevo email setup is complete and working!');
        console.log('🔄 Now restart your backend server to use email functionality.');
      } else {
        console.log('❌ Brevo API test failed:');
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        
        if (res.statusCode === 401) {
          console.log('\n🔧 Troubleshooting:');
          console.log('   1. Check your Brevo API key');
          console.log('   2. Make sure the API key starts with "xkeys-"');
          console.log('   3. Verify your Brevo account is active');
        } else if (res.statusCode === 400) {
          console.log('\n🔧 Check your email format and API request');
        }
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Brevo API connection failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify your Brevo API key');
    console.log('   3. Make sure your Brevo account is verified');
  });

  req.write(postData);
  req.end();
}

// Run the test
testBrevoSetup().catch(console.error);
