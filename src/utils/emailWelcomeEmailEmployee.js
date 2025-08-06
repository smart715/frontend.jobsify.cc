
// Email template utilities for company registration

/**
 * Generate professional HTML email template for customer welcome with login credentials
 */
export const generateCustomerWelcomeEmailTemplate = ({
  customerFirstName,
  customerLastName,
  companyName,
  companyId,
  customerEmail,
  password,
  loginUrl
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${companyName} - Your Account is Ready</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header .logo {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 600;
          opacity: 0.95;
        }
        .content {
          padding: 45px 40px;
        }
        .welcome-section {
          margin-bottom: 35px;
        }
        .welcome-text {
          font-size: 18px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .credentials-section {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 20%);
          border: 1px solid #ffc107;
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
          border-left: 5px solid #ffc107;
        }
        .credentials-section h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #856404;
          font-size: 20px;
          font-weight: 600;
        }
        .credential-item {
          background-color: white;
          padding: 20px;
          margin: 15px 0;
          border-radius: 8px;
          border: 1px solid #f0ad4e;
        }
        .credential-label {
          font-weight: 600;
          color: #856404;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #2c3e50;
          background-color: #f8f9fa;
          padding: 12px 15px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          word-break: break-all;
        }
        .security-notice {
          background-color: #d1ecf1;
          border: 1px solid #bee5eb;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          border-left: 5px solid #17a2b8;
        }
        .security-notice strong {
          color: #0c5460;
        }
        .action-section {
          text-align: center;
          margin: 40px 0;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: #ecf0f1;
          padding: 30px;
          text-align: center;
        }
        .footer .company-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .footer p {
          margin: 5px 0;
          opacity: 0.8;
        }
        .footer .disclaimer {
          font-size: 12px;
          color: #95a5a6;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #34495e;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .content {
            padding: 30px 20px;
          }
          .credentials-section {
            padding: 20px;
          }
          .login-button {
            padding: 15px 30px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${companyName.toUpperCase()}</div>
          <h1>Welcome to ${companyName}</h1>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <p class="welcome-text">
              Dear <strong>${customerFirstName} ${customerLastName}</strong>,
            </p>
            
            <p>
              Welcome to ${companyName}! Your customer account has been successfully created and is now ready to use. 
              You can now access our platform using the login credentials provided below.
            </p>
          </div>

          <div class="credentials-section">
            <h3>Your Login Credentials</h3>
            
            <div class="credential-item">
              <div class="credential-label">Email Address</div>
              <div class="credential-value">${customerEmail}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">Temporary Password</div>
              <div class="credential-value">${password}</div>
            </div>
          </div>

          <div class="security-notice">
            <strong>Important Security Notice:</strong> For your account security, please log in and change your password immediately after your first login. This temporary password should only be used for your initial access.
          </div>

          <div class="action-section">
            <a href="${loginUrl}" class="login-button">
              Login to Your Account
            </a>
          </div>

          <p>
            If you have any questions or need assistance, please don't hesitate to contact our support team. 
            We're here to help you get the most out of our platform.
          </p>
        </div>

        <div class="footer">
          <div class="company-name">${companyName.toUpperCase()}</div>
          <p>Thank you for choosing our services.</p>
          
          <div class="disclaimer">
            This email was sent to ${customerEmail}. If you did not expect this account, please contact our support team immediately.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate professional HTML email template for company registration with admin credentials
 */
export const generateCompanyWelcomeEmailTemplate = ({
  adminFirstName,
  adminLastName,
  companyName,
  companyId,
  adminEmail,
  password,
  companyPhone,
  loginUrl
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Jobsify - Company Registration Complete</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header .logo {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 600;
          opacity: 0.95;
        }
        .content {
          padding: 45px 40px;
        }
        .welcome-section {
          margin-bottom: 35px;
        }
        .welcome-text {
          font-size: 18px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .company-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid #dee2e6;
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
          border-left: 5px solid #667eea;
        }
        .company-info h3 {
          margin-top: 0;
          margin-bottom: 25px;
          color: #495057;
          font-size: 20px;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          gap: 20px;
        }
        .info-item {
          background-color: white;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: box-shadow 0.2s ease;
        }
        .info-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .info-label {
          font-weight: 600;
          color: #6c757d;
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #2c3e50;
          font-size: 16px;
          font-weight: 500;
        }
        .credentials-section {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 20%);
          border: 1px solid #ffc107;
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
          border-left: 5px solid #ffc107;
        }
        .credentials-section h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #856404;
          font-size: 20px;
          font-weight: 600;
        }
        .credential-item {
          background-color: white;
          padding: 20px;
          margin: 15px 0;
          border-radius: 8px;
          border: 1px solid #f0ad4e;
        }
        .credential-label {
          font-weight: 600;
          color: #856404;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #2c3e50;
          background-color: #f8f9fa;
          padding: 12px 15px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          word-break: break-all;
        }
        .security-notice {
          background-color: #d1ecf1;
          border: 1px solid #bee5eb;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          border-left: 5px solid #17a2b8;
        }
        .security-notice strong {
          color: #0c5460;
        }
        .action-section {
          text-align: center;
          margin: 40px 0;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }
        .features-section {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
        }
        .features-section h4 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #495057;
          font-size: 18px;
          font-weight: 600;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .features-list li {
          padding: 10px 0;
          color: #6c757d;
          border-bottom: 1px solid #e9ecef;
        }
        .features-list li:last-child {
          border-bottom: none;
        }
        .features-list li:before {
          content: "✓";
          color: #28a745;
          font-weight: bold;
          margin-right: 10px;
        }
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: #ecf0f1;
          padding: 30px;
          text-align: center;
        }
        .footer .company-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .footer p {
          margin: 5px 0;
          opacity: 0.8;
        }
        .footer .disclaimer {
          font-size: 12px;
          color: #95a5a6;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #34495e;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .content {
            padding: 30px 20px;
          }
          .company-info, .credentials-section {
            padding: 20px;
          }
          .login-button {
            padding: 15px 30px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">JOBSIFY</div>
          <h1>Welcome to Jobsify</h1>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <p class="welcome-text">
              Dear <strong>${adminFirstName} ${adminLastName}</strong>,
            </p>
            
            <p>
              Thank you for registering your company <strong>${companyName}</strong> with Jobsify. 
              Your company registration has been successfully completed, and your administrative account is now active.
            </p>
          </div>

          <div class="company-info">
            <h3>Company Registration Details</h3>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Company ID</div>
                <div class="info-value">${companyId}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Company Name</div>
                <div class="info-value">${companyName}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Administrator Email</div>
                <div class="info-value">${adminEmail}</div>
              </div>
              
              ${companyPhone ? `
              <div class="info-item">
                <div class="info-label">Phone Number</div>
                <div class="info-value">${companyPhone}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="credentials-section">
            <h3>Administrator Login Credentials</h3>
            
            <div class="credential-item">
              <div class="credential-label">Email Address</div>
              <div class="credential-value">${adminEmail}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">Temporary Password</div>
              <div class="credential-value">${password}</div>
            </div>
          </div>

          <div class="security-notice">
            <strong>Important Security Notice:</strong> For your account security, please log in to your dashboard and change your password immediately. This temporary password should only be used for your initial login.
          </div>

          <div class="action-section">
            <a href="${loginUrl}" class="login-button">
              Access Your Admin Dashboard
            </a>
          </div>

          <div class="features-section">
            <h4>What You Can Access</h4>
            <ul class="features-list">
              <li>Complete company profile management</li>
              <li>User management and role assignments</li>
              <li>Advanced analytics and reporting tools</li>
              <li>System configuration and settings</li>
              <li>Team collaboration features</li>
              <li>24/7 customer support access</li>
            </ul>
          </div>

          <p>
            Your account is fully activated and ready to use. Our comprehensive platform is designed to streamline your business operations and enhance productivity. If you need any assistance getting started, our support team is available to help.
          </p>
        </div>

        <div class="footer">
          <div class="company-name">JOBSIFY</div>
          <p>Professional Business Management Platform</p>
          <p>Thank you for choosing Jobsify for your business needs.</p>
          
          <div class="disclaimer">
            This email was sent to ${adminEmail}. If you did not register for this account, please contact our support team immediately.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
