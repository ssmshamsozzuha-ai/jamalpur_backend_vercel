const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const https = require('https');

class EmailService {
  constructor() {
    this.initializeServices();
  }

  initializeServices() {
    // Initialize Brevo (formerly Sendinblue) - Highest Priority
    if (process.env.BREVO_API_KEY) {
      this.brevoEnabled = true;
      this.brevoApiKey = process.env.BREVO_API_KEY;
    }

    // Initialize Brevo SMTP (alternative method)
    if (process.env.BREVO_SMTP_KEY) {
      this.brevoSmtpEnabled = true;
      this.brevoSmtpTransporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: 'smshamsozzuhas@gmail.com',
          pass: process.env.BREVO_SMTP_KEY
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.sendGridEnabled = true;
    }

    // Initialize Twilio for SMS
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.twilioEnabled = true;
    }

    // Initialize Gmail SMTP as fallback
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      this.gmailEnabled = true;
    }
  }

  // Send OTP via Email (with fallback)
  async sendOTPEmail(to, otp, userName) {
    const emailHtml = this.createOTPEmailTemplate(otp, userName);
    const subject = 'Password Reset OTP - Jamalpur Chamber of Commerce & Industry';

    // Try Brevo first (highest priority)
    if (this.brevoEnabled) {
      try {
        await this.sendViaBrevo(to, subject, emailHtml);
        console.log('✅ OTP sent via Brevo');
        return { success: true, method: 'Brevo' };
      } catch (error) {
        console.error('❌ Brevo failed:', error.message);
      }
    }

    // Try SendGrid second
    if (this.sendGridEnabled) {
      try {
        await this.sendViaSendGrid(to, subject, emailHtml);
        console.log('✅ OTP sent via SendGrid');
        return { success: true, method: 'SendGrid' };
      } catch (error) {
        console.error('❌ SendGrid failed:', error.message);
      }
    }

    // Fallback to Gmail SMTP
    if (this.gmailEnabled) {
      try {
        await this.sendViaGmail(to, subject, emailHtml);
        console.log('✅ OTP sent via Gmail SMTP');
        return { success: true, method: 'Gmail SMTP' };
      } catch (error) {
        console.error('❌ Gmail SMTP failed:', error.message);
      }
    }

    // If all email methods fail, return failure
    console.error('❌ All email services failed');
    return { success: false, method: 'none' };
  }

  // Send Password Reset Email (with fallback)
  async sendResetEmail(to, resetUrl, userName) {
    const emailHtml = this.createResetEmailTemplate(resetUrl, userName);
    const subject = 'Password Reset Link - Jamalpur Chamber of Commerce & Industry';

    // Try Brevo REST API first (most reliable)
    if (this.brevoEnabled) {
      try {
        await this.sendViaBrevo(to, subject, emailHtml);
        console.log('✅ Reset email sent via Brevo REST API');
        return { success: true, method: 'Brevo REST API' };
      } catch (error) {
        console.error('❌ Brevo REST API failed:', error.message);
      }
    }

    // Try Brevo SMTP second
    if (this.brevoSmtpEnabled) {
      try {
        await this.sendViaBrevoSMTP(to, subject, emailHtml);
        console.log('✅ Reset email sent via Brevo SMTP');
        return { success: true, method: 'Brevo SMTP' };
      } catch (error) {
        console.error('❌ Brevo SMTP failed:', error.message);
      }
    }

    // Try SendGrid second
    if (this.sendGridEnabled) {
      try {
        await this.sendViaSendGrid(to, subject, emailHtml);
        console.log('✅ Reset email sent via SendGrid');
        return { success: true, method: 'SendGrid' };
      } catch (error) {
        console.error('❌ SendGrid failed:', error.message);
      }
    }

    // Fallback to Gmail SMTP
    if (this.gmailEnabled) {
      try {
        await this.sendViaGmail(to, subject, emailHtml);
        console.log('✅ Reset email sent via Gmail SMTP');
        return { success: true, method: 'Gmail SMTP' };
      } catch (error) {
        console.error('❌ Gmail SMTP failed:', error.message);
      }
    }

    // If all email methods fail, return failure
    console.error('❌ All email services failed');
    return { success: false, method: 'none' };
  }

  // Send OTP via SMS (alternative method)
  async sendOTPSMS(phoneNumber, otp) {
    if (!this.twilioEnabled) {
      throw new Error('Twilio SMS service not configured');
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: `Your JCCI password reset OTP is: ${otp}. This code expires in 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('✅ OTP sent via SMS:', message.sid);
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('❌ SMS sending failed:', error.message);
      throw error;
    }
  }

  // Brevo SMTP implementation (highest priority)
  async sendViaBrevoSMTP(to, subject, html) {
    const mailOptions = {
      from: {
        name: 'Jamalpur Chamber of Commerce',
        address: 'smshamsozzuhas@gmail.com'
      },
      to: to,
      subject: subject,
      html: html
    };

    await this.brevoSmtpTransporter.sendMail(mailOptions);
  }

  // Brevo REST API implementation
  async sendViaBrevo(to, subject, html) {
    const emailData = {
      sender: {
        name: 'Jamalpur Chamber of Commerce',
        email: 'smshamsozzuhas@gmail.com'
      },
      to: [
        {
          email: to
        }
      ],
      subject: subject,
      htmlContent: html
    };
    
    const data = JSON.stringify(emailData);

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.brevoApiKey
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseData));
          } else {
            reject(new Error(`Brevo API error: ${res.statusCode} - ${responseData}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(data);
      req.end();
    });
  }

  // SendGrid implementation
  async sendViaSendGrid(to, subject, html) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@jamalpur-chamber.com',
      subject,
      html
    };

    await sgMail.send(msg);
  }

  // Gmail SMTP implementation
  async sendViaGmail(to, subject, html) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await this.gmailTransporter.sendMail(mailOptions);
  }

  // Create beautiful OTP email template
  createOTPEmailTemplate(otp, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Password Reset OTP</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Jamalpur Chamber of Commerce & Industry</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 24px;">Hello ${userName || 'User'},</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password for your JCCI account. Your One-Time Password (OTP) is:
            </p>
            
            <!-- OTP Display -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
              <p style="margin: 0 0 15px 0; color: white; font-size: 18px; font-weight: 600;">Your OTP Code:</p>
              <div style="background: white; padding: 25px; border-radius: 10px; border: 3px dashed #667eea; display: inline-block;">
                <h1 style="margin: 0; color: #667eea; font-size: 48px; letter-spacing: 8px; font-weight: 800; font-family: 'Courier New', monospace;">
                  ${otp}
                </h1>
              </div>
              <p style="margin: 20px 0 0 0; color: white; font-size: 14px; opacity: 0.9;">Enter this code on the password reset page</p>
            </div>
            
            <!-- Warning Box -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 16px;">
                ⏰ <strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="margin: 0; color: #991b1b; font-size: 16px;">
                🔒 <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately. Never share this OTP with anyone!
              </p>
            </div>
            
            <!-- Instructions -->
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px;">How to use this OTP:</h3>
              <ol style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 16px; line-height: 1.6;">
                <li>Go back to the password reset page</li>
                <li>Enter the 6-digit OTP code above</li>
                <li>Create your new password</li>
                <li>Click "Reset Password" to complete the process</li>
              </ol>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
              This is an automated message from the Jamalpur Chamber of Commerce & Industry system.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Please do not reply to this email. For support, contact us at support@jamalpur-chamber.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Create beautiful reset link email template
  createResetEmailTemplate(resetUrl, userName) {
    return '<h1>Password Reset Request</h1><p>Hello ' + (userName || 'User') + ',</p><p>We received a request to reset your password for your JCCI account. Click the link below to reset your password:</p><p><a href="' + resetUrl + '" style="background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset My Password</a></p><p>If the link does not work, copy and paste this URL into your browser:</p><p>' + resetUrl + '</p><p><strong>Important:</strong> This link will expire in 1 hour for security reasons. If you did not request this password reset, please ignore this email.</p><p>© 2024 Jamalpur Chamber of Commerce & Industry. All rights reserved.</p>';
  }

  createResetEmailTemplateOld(resetUrl, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Link</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Jamalpur Chamber of Commerce & Industry</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 24px;">Hello ${userName || 'User'},</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password for your JCCI account. Click the button below to reset your password:
            </p>
            
            <!-- Reset Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 18px 35px;
                text-decoration: none;
                border-radius: 10px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
              ">Reset My Password</a>
            </div>
            
            <!-- Warning Box -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 16px;">
                ⏰ <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="margin: 0; color: #991b1b; font-size: 16px;">
                🔒 <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately.
              </p>
            </div>
            
            <!-- Instructions -->
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px;">How to reset your password:</h3>
              <ol style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 16px; line-height: 1.6;">
                <li>Click the "Reset My Password" button above</li>
                <li>You'll be taken to a secure password reset page</li>
                <li>Enter your new password (at least 8 characters)</li>
                <li>Confirm your new password and click "Reset Password"</li>
              </ol>
            </div>
            
            <!-- Alternative Link -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; font-size: 14px; margin: 0; word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
              This is an automated message from the Jamalpur Chamber of Commerce & Industry system.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Please do not reply to this email. For support, contact us at support@jamalpur-chamber.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Get available services status
  getServiceStatus() {
    return {
      brevoSmtp: this.brevoSmtpEnabled,
      brevo: this.brevoEnabled,
      sendGrid: this.sendGridEnabled,
      gmail: this.gmailEnabled,
      twilio: this.twilioEnabled
    };
  }
}

module.exports = new EmailService();
