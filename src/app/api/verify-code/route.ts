import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const exisitingUser = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!exisitingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No user exists with this username",
        },
        {
          status: 404,
        }
      );
    } else {
      const isCodeValid = exisitingUser.verifyCode == code;
      const isCodeNotExpired = exisitingUser.verifyCodeExpiry > new Date();

      if (isCodeValid && isCodeNotExpired) {
        exisitingUser.isVerified = true;

        await exisitingUser.save();

        return NextResponse.json(
          {
            success: true,
            message: "Account verified successfully",
          },
          {
            status: 200,
          }
        );
      } else if (!isCodeNotExpired) {
        return NextResponse.json(
          {
            success: true,
            message:
              "Verification code has expired. Please sign up again to get a new verification code.",
          },
          {
            status: 400,
          }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Incorrect verification code",
          },
          {
            status: 404,
          }
        );
      }
    }
  } catch (err) {
    console.error("Error while verifying the user", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying the user",
      },
      {
        status: 500,
      }
    );
  }
}
