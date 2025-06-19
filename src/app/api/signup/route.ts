import connectDb from "@/app/api/route";
import User from "../model/route";
import { sendVerificationEmail } from "@/app/component/sendverificationemial";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { name, email, password } = await request.json();

    const isVerifiedUserAlreadyExists = await User.findOne({
      $or: [{ email }, { name }],
      isverified: true,
    });

    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isVerifiedUserAlreadyExists) {
      if (isVerifiedUserAlreadyExists.isverified) {
        return Response.json({
          message: "User already Exists With this email",
          success: false,
        });
      } else {
        const haspass = await bcrypt.hash(password, 10);
        isVerifiedUserAlreadyExists.password = haspass;
        isVerifiedUserAlreadyExists.otp = verifycode;
        isVerifiedUserAlreadyExists.verifycodeExpiry = new Date(
          Date.now() + 3600000
        ); 

        await isVerifiedUserAlreadyExists.save();
      }
    }
    else{ 
      
    const haspass = await bcrypt.hash(password, 10);
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);


      const newUser = new User({
        name,
        email,
        otp: verifycode,
        password: haspass,
        verifycodeExpiry: expiryTime
      });

      await newUser.save(); 
    }
      const SendVerificationEmail = await sendVerificationEmail(
      name,
      verifycode,
      email
    );
  
    if (!SendVerificationEmail.success) {
      return Response.json({
        success: false,
        message: "Failed to send verification email",
      });
    }
    return Response.json({
      success: true,
      message:
        "User created successfully, please check your email for verification",
    });
  }   catch (error) {
    console.error("Error in signup route:", error);
    return Response.json({
      success: false,
      message: `An error occurred while processing your request: ${(error as Error).message}`,
    });
  }
}
