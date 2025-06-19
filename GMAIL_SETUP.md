# Gmail Setup Guide for NodeMailer

## Common Gmail Authentication Issues

If you're seeing errors like `535-5.7.8 Username and Password not accepted`, it means Gmail is rejecting your authentication. Here's how to fix it:

## Complete Gmail Setup Process

### Step 1: Enable 2-Step Verification (Required)

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left navigation
3. Under "Signing in to Google," select **2-Step Verification**
4. Follow the steps to turn on 2-Step Verification

### Step 2: Create an App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security**
3. Under "Signing in to Google," select **App passwords** (you'll only see this if 2-Step Verification is enabled)
4. At the bottom of the page, select **Select app** and choose **Mail**
5. Select **Select device** and choose **Other (Custom name)**
6. Enter a name like "MyNodeApp"
7. Click **Generate**
8. Google will display a 16-character app password. **Copy this password**

### Step 3: Update Your Environment Variables

Create or update your `.env.local` file with the following:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

For example:
```
EMAIL_USER=yt781703@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**IMPORTANT:** Remove any spaces from the app password when adding it to your .env file.

### Step 4: Test Your Configuration

Run the test script to verify your email configuration:

```bash
node test-email.js
```

Make sure to update the recipient email in the test script before running it.

## Troubleshooting

### Error: Invalid login

If you see `Error: Invalid login: 535-5.7.8 Username and Password not accepted`, check:

1. **Is 2-Step Verification enabled?** This is required for app passwords.
2. **Is the app password correct?** It should be 16 characters with no spaces.
3. **Are you using the right email?** Make sure the email in your code matches the one you generated the app password for.

### Error: No recipients defined

This error occurs when the email address is invalid or missing. Check:

1. **Is the email format valid?** It should include `@` and a domain.
2. **Are you passing parameters correctly?** Make sure you're passing the email address as the third parameter to the `sendVerificationEmail` function.

### Testing Gmail in Development

For testing during development, consider:

1. **Using a test email service** like Mailtrap
2. **Using a different email service** that's easier to set up, like SendGrid
3. **Creating a separate Gmail account** just for testing

## Need More Help?

For additional assistance with Gmail configuration:
- Visit [Google's Support Page](https://support.google.com/mail/answer/185833?hl=en)
- Check the [Nodemailer documentation](https://nodemailer.com/usage/using-gmail/)

```typescript
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-16-character-app-password' // Use the app password here, not your regular Gmail password
  }
});
```

## Troubleshooting

### 1. Verify Your Configuration

Run this test code to verify your email configuration:

```javascript
// Test your configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
```

### 2. Check for Common Issues

- Make sure you're using the correct email address
- Ensure you're using the app password, not your regular Gmail password
- Confirm that 2-Step Verification is enabled
- Check if your app password has expired (you might need to generate a new one)
- Make sure you're using the correct SMTP settings (host, port, secure)

### 3. Gmail Rate Limits

Be aware that Gmail has sending limits:
- Personal Gmail accounts: 500 emails per day
- Google Workspace accounts: 2,000 emails per day

### 4. Production Recommendations

For a production application, consider using a dedicated email service like:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

These services offer better deliverability, higher sending limits, and more reliable performance.

## Testing Your Configuration

You can run the included test file to verify your email setup:

```bash
node test-email.js
```

This will attempt to send a test email and will provide detailed logs if it fails.
