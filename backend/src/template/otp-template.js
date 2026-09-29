export const returnHtml = (otp) => {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f5;
        }
        .email-header {
            background-color: #fe7f2d;;
            padding: 32px 24px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .email-body {
            padding: 40px 32px;
            color: #333333;
        }
        .email-body p {
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
            color: #4b5563;
        }
        .otp-container {
            background-color: #f3f4f6;
            border-radius: 6px;
            padding: 16px;
            text-align: center;
            margin: 32px 0;
            border: 1px dashed #cbd5e1;
        }
        .otp-code {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #1e1b4b;
            margin: 0;
        }
        .email-footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
        }
        .email-footer p {
            font-size: 13px;
            color: #9ca3af;
            margin: 0 0 8px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>TechMitra</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p>Hello,</p>
            <p>We received a request to verify your account. Use the following One-Time Password (OTP) to complete your verification. This code is valid for 5 minutes.</p>
            
            <div class="otp-container">
                <p class="otp-code">${otp}</p>
            </div>
            
            <p>If you did not request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
            <p>Best regards,<br>The TechMitra Team</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; 2026 TechMitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

    `;
}