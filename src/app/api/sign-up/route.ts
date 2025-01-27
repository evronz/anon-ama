import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const exisitingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (!exisitingUserByUsername?.isVerified) {
      NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 201,
        }
      );
    }

    const exisitingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (exisitingUserByEmail) {
      if (exisitingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exisitingUserByEmail.password = hashedPassword;
        exisitingUserByEmail.verifyCode = verifyCode;
        exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);
        const expiry = new Date(Date.now());

        await exisitingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error("Error while registering user", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while registering user",
      },
      {
        status: 500,
      }
    );
  }
}
