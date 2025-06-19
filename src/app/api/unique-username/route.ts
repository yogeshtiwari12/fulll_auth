import { use } from "react";
import { usernameQuerySchema } from "../schemas/username-querrySchema";
import User from "../model/route";
import connectDb from "../route";

export async function GET(request: Request) {

    await connectDb();

    
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParams);
    
  
    if (!result.success) {
      const usernamerror =
        result.error.format().username?._errors?.[0] || "Invalid username";

      return Response.json({
        success: false,
        message: usernamerror?.length > 0 ? usernamerror : "Invalid username",
      });
    }
    const { username } = result.data;

    const isexixstingUser = await User.findOne({
      username: username,
      isverified: true,
    });
    if (isexixstingUser) {
      return Response.json({
        success: false,
        message: "Username already exists",
      });
    }

    return Response.json({
      success: true,
      message: "Username is unique",
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
