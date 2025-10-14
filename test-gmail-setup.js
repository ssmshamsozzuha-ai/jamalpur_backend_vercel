const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailSetup() {
  console.log('🧪 Testing Gmail SMTP Configuration...\n');

  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Missing email credentials in .env file');
    console.log('📝 Please add:');
    console.log('   EMAIL_USER=smhamsozzuhas@gmail.com');
    console.log('   EMAIL_PASS=your-16-character-app-password');
    return;
  }

  console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`🔑 App Password: ${process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'Not set'}\n`);

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Test connection
    console.log('🔌 Testing Gmail connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '🧪 Gmail SMTP Test - Jamalpur Chamber',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0;">✅ Gmail SMTP Test Successful!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Jamalpur Chamber of Commerce & Industry</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e40af; margin-top: 0;">Email Configuration Working!</h2>
            <p>Your Gmail SMTP is properly configured and ready to send password reset emails.</p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #155724;"><strong>✅ What this means:</strong></p>
              <ul style="color: #155724; margin: 10px 0 0 20px;">
                <li>Password reset emails will be sent automatically</li>
                <li>Users will receive proper email notifications</li>
                <li>No more showing URLs on screen</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Next steps:</strong> Restart your backend server and test the password reset functionality.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your inbox: ${process.env.EMAIL_USER}\n`);

    console.log('🎉 Gmail SMTP setup is complete and working!');
    console.log('🔄 Now restart your backend server to use email functionality.');

  } catch (error) {
    console.log('❌ Gmail SMTP test failed:');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.message.includes('Invalid login')) {
      console.log('🔧 Troubleshooting:');
      console.log('   1. Make sure 2-Factor Authentication is enabled');
      console.log('   2. Generate a new App Password (not your regular password)');
      console.log('   3. Use the 16-character App Password in .env file');
      console.log('   4. Remove spaces from the App Password');
    } else if (error.message.includes('Less secure app access')) {
      console.log('🔧 Enable "Less secure app access" in Gmail settings');
    } else {
      console.log('🔧 Check your internet connection and try again');
    }
  }
}

// Run the test
testGmailSetup().catch(console.error);
