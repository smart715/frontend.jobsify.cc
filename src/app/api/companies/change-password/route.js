
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

// Function to generate professional password change notification email
const generatePasswordChangeNotificationTemplate = ({ 
  adminFirstName, 
  adminLastName, 
  companyName, 
  companyId,
  adminEmail,
  changedBy,
  changeDate 
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed - Security Notification</title>
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
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
        .alert-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          border-left: 4px solid #f39c12;
        }
        .alert-icon {
          font-size: 24px;
          margin-right: 10px;
          color: #f39c12;
        }
        .welcome-text {
          font-size: 18px;
          margin-bottom: 25px;
          color: #34495e;
        }
        .info-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
          border-left: 4px solid #3498db;
        }
        .info-section h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ecf0f1;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #7f8c8d;
          min-width: 120px;
        }
        .info-value {
          color: #2c3e50;
          font-weight: 500;
        }
        .security-notice {
          background: #e8f5e8;
          border: 1px solid #c3e6c3;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          border-left: 4px solid #27ae60;
        }
        .security-notice h4 {
          margin-top: 0;
          color: #27ae60;
          font-size: 16px;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 15px 35px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s ease;
        }
        .login-button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background: #2c3e50;
          color: #ecf0f1;
          padding: 30px;
          text-align: center;
        }
        .footer-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }
        .footer-links {
          margin-top: 20px;
        }
        .footer-links a {
          color: #3498db;
          text-decoration: none;
          margin: 0 15px;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .content {
            padding: 25px 20px;
          }
          .header {
            padding: 25px 20px;
          }
          .info-item {
            flex-direction: column;
            gap: 5px;
          }
          .info-label {
            min-width: auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔐 Jobsify</div>
          <h1>Password Changed</h1>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <span class="alert-icon">⚠️</span>
            <strong>Security Alert:</strong> Your company account password has been successfully changed.
          </div>
          
          <p class="welcome-text">
            Hello <strong>${adminFirstName} ${adminLastName}</strong>,
          </p>
          
          <p>This is to notify you that the password for your company account has been changed successfully.</p>
          
          <div class="info-section">
            <h3>📋 Password Change Details</h3>
            <div class="info-item">
              <span class="info-label">Company:</span>
              <span class="info-value">${companyName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Company ID:</span>
              <span class="info-value">${companyId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Admin Email:</span>
              <span class="info-value">${adminEmail}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Changed By:</span>
              <span class="info-value">${changedBy}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Change Date:</span>
              <span class="info-value">${changeDate}</span>
            </div>
          </div>
          
          <div class="security-notice">
            <h4>🔒 Security Notice</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>If you did not request this change, please contact support immediately</li>
              <li>Make sure to use your new password for all future logins</li>
              <li>Keep your password secure and do not share it with others</li>
              <li>Consider enabling two-factor authentication for additional security</li>
            </ul>
          </div>
          
          <div class="cta-section">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="login-button">
              🚀 Login to Your Account
            </a>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
            If you have any questions or concerns about this password change, please contact our support team immediately.
          </p>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            This is an automated security notification from Jobsify.<br>
            Please do not reply to this email.
          </p>
          <div class="footer-links">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/support">Contact Support</a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}">Visit Website</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send password change notification email using Mailgun API
async function sendPasswordChangeNotification(companyData, changedBy) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.warn('Mailgun not configured - password change email not sent');
    return { success: false, error: 'Mailgun not configured' };
  }

  const changeDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const htmlTemplate = generatePasswordChangeNotificationTemplate({
    adminFirstName: companyData.adminFirstName,
    adminLastName: companyData.adminLastName,
    companyName: companyData.companyName,
    companyId: companyData.companyId,
    adminEmail: companyData.adminEmail,
    changedBy: changedBy,
    changeDate: changeDate
  });

  const formData = new FormData();
  formData.append('from', `${process.env.MAILGUN_FROM_NAME || 'Jobsify Security'} <${process.env.MAILGUN_FROM_EMAIL || 'security@jobsify.cc'}>`);
  formData.append('to', companyData.adminEmail);
  formData.append('subject', `🔐 Password Changed - ${companyData.companyName} | Jobsify Security Alert`);
  formData.append('html', htmlTemplate);

  try {
    const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Password change notification sent successfully:', result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Error sending password change notification:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId, newPassword } = await request.json()

    if (!companyId || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Company ID and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Get the company details
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
        companyId: true,
        adminEmail: true,
        adminFirstName: true,
        adminLastName: true
      }
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update the company admin's password in the database
    const updatedUser = await prisma.user.update({
      where: { email: company.adminEmail },
      data: {
        hashedPassword: hashedNewPassword
      }
    })

    // Send password change notification email (non-blocking)
    try {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { firstName: true, lastName: true, role: true }
      });

      const changedBy = currentUser?.role === 'SUPER_ADMIN' 
        ? `Super Admin (${currentUser.firstName} ${currentUser.lastName})`
        : `${currentUser?.firstName || 'Unknown'} ${currentUser?.lastName || 'User'}`;

      await sendPasswordChangeNotification(company, changedBy);
      console.log('Password change notification sent to:', company.adminEmail);
    } catch (emailError) {
      console.warn('Failed to send password change notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully and notification sent'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
