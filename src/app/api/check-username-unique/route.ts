import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidationSchema } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidationSchema,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameError = result.error?.format().username?._errors || [];
      return NextResponse.json(
        {
          success: "false",
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        {
          status: 500,
        }
      );
    }

    const username = result.data?.username;

    const exisitingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUser) {
      return NextResponse.json(
        {
          success: "false",
          message: "Username is already taken",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: "false",
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: "false",
        message: "Error while checking username",
      },
      {
        status: 500,
      }
    );
  }
}
