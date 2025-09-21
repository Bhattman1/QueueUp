// Notification system for Queue Up
// Supports email (dev) and SMS (Twilio) notifications

interface NotificationOptions {
  to: string;
  subject?: string;
  message: string;
  type: 'email' | 'sms';
}

interface EmailNotificationOptions extends NotificationOptions {
  type: 'email';
  subject: string;
}

interface SMSNotificationOptions extends NotificationOptions {
  type: 'sms';
}

export async function sendEmail(options: EmailNotificationOptions): Promise<boolean> {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email Notification:', {
        to: options.to,
        subject: options.subject,
        message: options.message,
        timestamp: new Date().toISOString(),
      });
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    }

    // In production, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP
    
    console.log('Email service not configured for production');
    return false;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendSMS(options: SMSNotificationOptions): Promise<boolean> {
  try {
    // Check if Twilio is configured
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioMessagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!twilioAccountSid || !twilioAuthToken || !twilioMessagingServiceSid) {
      console.log('📱 SMS Notification (Twilio not configured):', {
        to: options.to,
        message: options.message,
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    // In development, just log the SMS
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 SMS Notification:', {
        to: options.to,
        message: options.message,
        timestamp: new Date().toISOString(),
      });
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return true;
    }

    // In production, use Twilio
    // const client = require('twilio')(twilioAccountSid, twilioAuthToken);
    // await client.messages.create({
    //   messagingServiceSid: twilioMessagingServiceSid,
    //   to: options.to,
    //   body: options.message,
    // });

    console.log('SMS service not configured for production');
    return false;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

// Convenience functions for common notifications
export async function notifyTableReady(
  phone: string | undefined,
  email: string | undefined,
  restaurantName: string,
  bufferMins: number = 10
): Promise<void> {
  const message = `Your table is ready at ${restaurantName}! Please return within ${bufferMins} minutes.`;

  const promises: Promise<boolean>[] = [];

  if (email) {
    promises.push(sendEmail({
      to: email,
      subject: `Table Ready - ${restaurantName}`,
      message,
      type: 'email',
    }));
  }

  if (phone) {
    promises.push(sendSMS({
      to: phone,
      message,
      type: 'sms',
    }));
  }

  await Promise.all(promises);
}

export async function notifyQueueUpdate(
  phone: string | undefined,
  email: string | undefined,
  restaurantName: string,
  position: number,
  etaMins: number
): Promise<void> {
  const message = `Queue update for ${restaurantName}: You're #${position} in line, estimated wait: ${etaMins} minutes.`;

  const promises: Promise<boolean>[] = [];

  if (email) {
    promises.push(sendEmail({
      to: email,
      subject: `Queue Update - ${restaurantName}`,
      message,
      type: 'email',
    }));
  }

  if (phone) {
    promises.push(sendSMS({
      to: phone,
      message,
      type: 'sms',
    }));
  }

  await Promise.all(promises);
}
