import { Router, Request, Response, NextFunction } from 'express';
import { emailVerificationTemplate, sendEmail } from '../Helper/email';
import OtpModel from '../Models/Otp.model';
import { throwError } from "../Helper/error";
const router = Router();

router.post('/sendOTP', async (req: Request, res: Response, next: NextFunction) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    await OtpModel.findOneAndUpdate(
      { Email: req.body.email },
      {
        Email: req.body.email,
        Code: otp,
        IsUsed: false,
        CreatedOn: Date.now(),
      },
      { new: true, upsert: true }
    );

    const emailSent = await sendEmail({
      to: req.body.email,
      subject: 'Verification for Account',
      html: emailVerificationTemplate(otp),
    });

    if (!emailSent) {
      return next(throwError(500, 'Failed to send OTP'));
    }

    return res.status(200).json({
      Status: true,
      Message: 'OTP sent successfully!',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/validateOTP', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await OtpModel.findOne({ Email: req.body.email });
    if (!record) return next(throwError(400, 'OTP not found'));
    if (record.IsUsed) return next(throwError(400, 'OTP already used'));

    const expiryDate = new Date(record.CreatedOn);
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);

    const currentTime = new Date();
    if (currentTime > expiryDate) return next(throwError(400, 'OTP has expired'));

    if (req.body.otp != record.Code) return next(throwError(400, 'Invalid OTP'));

    record.IsUsed = true;
    await record.save();

    return res.status(200).json({
      Status: true,
      Message: 'Validation Successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
