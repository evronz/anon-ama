import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        messsage: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session._id;

  try {
    const user = await UserModel.findById(userId);

    const userMessages = await UserModel.aggregate([
      { $match: { _id: user?._id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        }
      );
    }

    if (userMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No messages to be retrieved",
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error while retrieving messages", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while retrieving messages",
      },
      {
        status: 500,
      }
    );
  }
}
