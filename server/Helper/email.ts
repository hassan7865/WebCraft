import nodemailer, { Transporter } from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}


export const sendEmail = async ({
  to,
  subject,
  html,
 
}: EmailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `"WebCraft 👻" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return info.accepted.length > 0;
  } catch (error: any) {
    console.error('Failed to send email:', error.message);
    return false;
  }
};


export const emailVerificationTemplate = (otp: any) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">WebCraft</h2>
      <p>Hi,</p>
      <p>Thank you for registering at <strong>WebCraft</strong>. Use the following OTP to verify your email. This code is valid for 10 minutes:</p>
      <h2 style="background:#00466a; color:white; width:max-content; padding:10px; border-radius:5px;">${otp}</h2>
      <p>Regards,<br/>WebCraft Team</p>
    </div>
  </div>
`;


