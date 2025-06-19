## Email Configuration

This application uses Nodemailer to send verification emails. Follow these steps to set up email:

1. Create a `.env.local` file in the root directory (if not already present)
2. Add the following environment variables:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Creating an App Password for Gmail

If you're using Gmail, you'll need to create an app password:

1. Go to your Google Account settings
2. Select "Security"
3. Under "Signing in to Google," select "2-Step Verification" (enable it if not already)
4. At the bottom of the page, select "App passwords"
5. Select "Mail" as the app and "Other" as the device, then give it a name
6. Copy the generated app password and use it as `EMAIL_PASSWORD` in your .env.local file

Note: Never commit your .env.local file to version control!
