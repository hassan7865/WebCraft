import mongoose from "mongoose";
const MONGOURL = process.env.MONGOURL;

const connect = async () => {
  if (!MONGOURL) {
    console.error("MONGOURL is not defined in environment variables.");
    process.exit(1); 
  }

  try {
    await mongoose.connect(MONGOURL);
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1); 
  }
};

export default connect;
