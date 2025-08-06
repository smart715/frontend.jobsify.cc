
// Email template utilities for super admin registration

/**
 * Generate professional HTML email template for super admin welcome with login credentials
 */
export const generateSuperAdminWelcomeEmailTemplate = ({
  firstName,
  lastName,
  email,
  password,
  loginUrl
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Jobsify - Super Admin Account Created</title>
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
          <div class="logo">JOBSIFY</div>
          <h1>Welcome to Jobsify</h1>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <p class="welcome-text">
              Dear <strong>${firstName} ${lastName}</strong>,
            </p>
            
            <p>
              Welcome to Jobsify! Your Super Administrator account has been successfully created and is now active.
              You now have full administrative access to the Jobsify platform with the highest level of privileges.
            </p>
          </div>

          <div class="credentials-section">
            <h3>Your Login Credentials</h3>
            
            <div class="credential-item">
              <div class="credential-label">Email Address</div>
              <div class="credential-value">${email}</div>
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
              Access Your Super Admin Dashboard
            </a>
          </div>

          <div class="features-section">
            <h4>Super Admin Privileges</h4>
            <ul class="features-list">
              <li>Complete platform administration and oversight</li>
              <li>User and company management across all accounts</li>
              <li>System-wide configuration and settings</li>
              <li>Advanced analytics and comprehensive reporting</li>
              <li>Module and feature management</li>
              <li>Full access to all administrative tools</li>
              <li>Priority support and direct assistance</li>
            </ul>
          </div>

          <p>
            As a Super Administrator, you have the highest level of access to manage and oversee the entire Jobsify platform.
            If you need any assistance getting started or have questions about your administrative privileges, our support team is available to help.
          </p>
        </div>

        <div class="footer">
          <div class="company-name">JOBSIFY</div>
          <p>Professional Business Management Platform</p>
          <p>Thank you for joining our administrative team.</p>
          
          <div class="disclaimer">
            This email was sent to ${email}. If you did not expect this account, please contact our support team immediately.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default {
  generateSuperAdminWelcomeEmailTemplate
};
