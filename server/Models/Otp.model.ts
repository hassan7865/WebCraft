import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOtp extends Document {
  Email: string;
  Code: number;
  IsUsed: boolean;
  CreatedOn: Date;
}

const OtpSchema: Schema<IOtp> = new Schema<IOtp>({
  Email: { type: String, required: true },
  Code: { type: Number, required: true },
  IsUsed: { type: Boolean, required: true, default: false },
  CreatedOn: { type: Date, required: true, default: Date.now },
});

const OtpModel: Model<IOtp> = mongoose.model<IOtp>('OTP', OtpSchema);

export default OtpModel;
