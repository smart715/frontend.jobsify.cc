
// Email template utilities
export const generateAdminWelcomeEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to Jobsify</title>
    </head>
    <body>
      <h1>Welcome ${data.adminFirstName} ${data.adminLastName}!</h1>
      <p>
              Welcome to ${data.companyName}! Your company account has been successfully created with a <strong>30-day free trial period</strong>. 
              Below are your login credentials and important information about your account.
            </p>

            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">🎉 Free Trial Active</h3>
              <p style="margin: 10px 0;">
                • <strong>Trial Period:</strong> 30 days from today<br>
                • <strong>Full Access:</strong> All features available during trial<br>
                • <strong>No Credit Card:</strong> Required during trial period
              </p>
              <p style="margin: 10px 0; font-size: 14px; color: #666;">
                After your trial expires, you'll need to choose a subscription plan to continue using our services.
              </p>
            </div>
      <p>Company ID: ${data.companyId}</p>
      <p>Email: ${data.adminEmail}</p>
      <p>Password: ${data.password}</p>
      <p>Phone: ${data.companyPhone}</p>
      <p><a href="${data.loginUrl}">Login to your account</a></p>
    </body>
    </html>
  `;
};

export const generateCompanyWelcomeEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Jobsify - Company Registration Complete</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 680px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 50px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="2" fill="white" opacity="0.1"/><circle cx="60" cy="30" r="1" fill="white" opacity="0.1"/><circle cx="30" cy="70" r="1" fill="white" opacity="0.1"/></svg>');
          pointer-events: none;
        }
        .logo {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 2px;
          position: relative;
          z-index: 1;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 50px 40px;
        }
        .welcome-section {
          margin-bottom: 40px;
        }
        .welcome-text {
          font-size: 18px;
          margin-bottom: 24px;
          color: #2c3e50;
          line-height: 1.7;
        }
        .company-highlight {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid #dee2e6;
          border-radius: 12px;
          padding: 32px;
          margin: 32px 0;
          border-left: 5px solid #667eea;
          position: relative;
        }
        .company-highlight::before {
          content: '🏢';
          position: absolute;
          top: -10px;
          left: 20px;
          background: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .company-highlight h3 {
          margin: 0 0 24px 0;
          color: #495057;
          font-size: 22px;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          gap: 16px;
        }
        .info-item {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .info-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }
        .info-label {
          font-weight: 600;
          color: #6c757d;
          font-size: 13px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .info-value {
          color: #2c3e50;
          font-size: 16px;
          font-weight: 500;
          word-break: break-word;
        }
        .trial-section {
          background: linear-gradient(135deg, #e8f5e8 0%, #f0f9ff 100%);
          border: 2px solid #22c55e;
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          position: relative;
          overflow: hidden;
        }
        .trial-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        .trial-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .trial-icon {
          font-size: 32px;
          margin-right: 12px;
        }
        .trial-title {
          margin: 0;
          color: #059669;
          font-size: 24px;
          font-weight: 700;
        }
        .trial-features {
          display: grid;
          gap: 12px;
          margin: 20px 0;
        }
        .trial-feature {
          display: flex;
          align-items: center;
          color: #047857;
          font-weight: 500;
        }
        .trial-feature::before {
          content: '✓';
          background: #22c55e;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .credentials-section {
          background: linear-gradient(135deg, #fff9e6 0%, #fef3c7 100%);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          position: relative;
        }
        .credentials-section::before {
          content: '🔐';
          position: absolute;
          top: -12px;
          left: 24px;
          background: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .credentials-section h3 {
          margin: 0 0 24px 0;
          color: #92400e;
          font-size: 22px;
          font-weight: 600;
        }
        .credential-item {
          background-color: white;
          padding: 24px;
          margin: 16px 0;
          border-radius: 12px;
          border: 1px solid #f59e0b;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);
        }
        .credential-label {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 8px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .credential-value {
          font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Courier New', monospace;
          font-size: 16px;
          color: #1f2937;
          background-color: #f9fafb;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          word-break: break-all;
          font-weight: 500;
        }
        .security-notice {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #f87171;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          border-left: 5px solid #ef4444;
        }
        .security-notice-icon {
          font-size: 20px;
          margin-right: 8px;
        }
        .security-notice strong {
          color: #dc2626;
        }
        .action-section {
          text-align: center;
          margin: 48px 0;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 40px;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          border: none;
          cursor: pointer;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }
        .features-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          border: 1px solid #e2e8f0;
        }
        .features-section h4 {
          margin: 0 0 24px 0;
          color: #475569;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .feature-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .feature-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }
        .feature-item::before {
          content: "✓";
          color: #22c55e;
          font-weight: bold;
          margin-right: 12px;
          font-size: 16px;
        }
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #e2e8f0;
          padding: 40px;
          text-align: center;
        }
        .footer-logo {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
        .footer p {
          margin: 8px 0;
          opacity: 0.8;
        }
        .footer-disclaimer {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #475569;
          line-height: 1.5;
        }
        @media (max-width: 640px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }
          .header, .content {
            padding: 30px 20px;
          }
          .company-highlight, .trial-section, .credentials-section {
            padding: 24px 20px;
          }
          .login-button {
            padding: 16px 32px;
            font-size: 15px;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">JOBSIFY</div>
          <h1>Welcome to Jobsify Platform</h1>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <p class="welcome-text">
              Dear <strong>${data.adminFirstName} ${data.adminLastName}</strong>,
            </p>
            
            <p>
              Congratulations! Your company <strong>${data.companyName}</strong> has been successfully registered with Jobsify. 
              Your administrative account is now active and ready to use with full access to our platform.
            </p>
          </div>

          <div class="company-highlight">
            <h3>Company Registration Details</h3>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Company ID</div>
                <div class="info-value">${data.companyId}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Company Name</div>
                <div class="info-value">${data.companyName}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Administrator Email</div>
                <div class="info-value">${data.adminEmail}</div>
              </div>
              
              ${data.companyPhone ? `
              <div class="info-item">
                <div class="info-label">Phone Number</div>
                <div class="info-value">${data.companyPhone}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="trial-section">
            <div class="trial-header">
              <span class="trial-icon">🎉</span>
              <h3 class="trial-title">30-Day Free Trial Active</h3>
            </div>
            
            <div class="trial-features">
              <div class="trial-feature">Trial Period: 30 days from today</div>
              <div class="trial-feature">Full Access: All features available during trial</div>
              <div class="trial-feature">No Credit Card: Required during trial period</div>
              <div class="trial-feature">Cancel Anytime: No commitment required</div>
            </div>
            
            <p style="margin: 16px 0 0 0; font-size: 14px; color: #047857; font-weight: 500;">
              After your trial expires, you'll need to choose a subscription plan to continue using our services.
            </p>
          </div>

          <div class="credentials-section">
            <h3>Administrator Login Credentials</h3>
            
            <div class="credential-item">
              <div class="credential-label">Email Address</div>
              <div class="credential-value">${data.adminEmail}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">Temporary Password</div>
              <div class="credential-value">${data.password}</div>
            </div>
          </div>

          <div class="security-notice">
            <span class="security-notice-icon">🔒</span>
            <strong>Important Security Notice:</strong> For your account security, please log in to your dashboard and change your password immediately. This temporary password should only be used for your initial login.
          </div>

          <div class="action-section">
            <a href="${data.loginUrl}" class="login-button">
              Access Your Admin Dashboard
            </a>
          </div>

          <div class="features-section">
            <h4>What You Can Access</h4>
            <div class="features-grid">
              <div class="feature-item">Complete company profile management</div>
              <div class="feature-item">User management and role assignments</div>
              <div class="feature-item">Advanced analytics and reporting tools</div>
              <div class="feature-item">System configuration and settings</div>
              <div class="feature-item">Team collaboration features</div>
              <div class="feature-item">24/7 customer support access</div>
            </div>
          </div>

          <p style="margin-top: 32px; color: #64748b; line-height: 1.7;">
            Your account is fully activated and ready to use. Our comprehensive platform is designed to streamline your business operations and enhance productivity. If you need any assistance getting started, our support team is available to help.
          </p>
        </div>

        <div class="footer">
          <div class="footer-logo">JOBSIFY</div>
          <p>Professional Business Management Platform</p>
          <p>Thank you for choosing Jobsify for your business needs.</p>
          
          <div class="footer-disclaimer">
            This email was sent to ${data.adminEmail}. If you did not register for this account, please contact our support team immediately.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateCustomerWelcomeEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to ${data.companyName}</title>
    </head>
    <body>
      <h1>Welcome ${data.customerFirstName} ${data.customerLastName}!</h1>
      <p>Your account for "${data.companyName}" has been created.</p>
      <p>Company ID: ${data.companyId}</p>
      <p>Email: ${data.customerEmail}</p>
      <p>Password: ${data.password}</p>
      <p><a href="${data.loginUrl}">Login to your account</a></p>
    </body>
    </html>
  `;
};

export default {
  generateAdminWelcomeEmailTemplate,
  generateCompanyWelcomeEmailTemplate,
  generateCustomerWelcomeEmailTemplate
};
