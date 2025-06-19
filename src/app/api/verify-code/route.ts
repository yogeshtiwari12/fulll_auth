import User from "../model/route";
import connectDb from "../route";

export async function POST(request: Request) {
  const { name, otp } = await request.json();
  console.log("Received Name:", name);
  console.log("Received OTP:", otp);
  await connectDb();
  try {
    const decodedusername = decodeURIComponent(name);
    console.log("Decoded Username:", decodedusername);
    const user = await User.findOne({ name: decodedusername });

    if (!user) {
      return Response.json({
        success: false,
        message: `User Not found`,
      });
    }

    const iscodeVerify = user.otp === otp;
    const expirytime = new Date(user.verifycodeExpiry) > new Date();

    if (iscodeVerify && expirytime) {
      user.isverified = true;
      await user.save();

      return Response.json({
        success: false,
        message: `User Verified Succesfully`,
      });
    } else if (!expirytime) {
      return Response.json({
        success: false,
        message: `Verification Code Expired`, //jb time expire ho jaye
      });
    } else {
      return Response.json({
        success: false,
        message: `Invalid Verification Code`, //jbbb code glt hoga
      });
    }
  } catch (error) {
    console.error("Error in verify code:", error);
    return Response.json({
      success: false,
      message: `Failed to verify code: ${error as Error}.message`,
    });
  }
}
