import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!foundUser.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    foundUser.messages.push(newMessage as Message);
    await foundUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent succeesfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Error adding messages",
      },
      {
        status: 500,
      }
    );
  }
}
