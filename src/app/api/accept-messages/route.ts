import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update user status to accept message",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Message acceptance status updated succesfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error while updating user status to accept messsages", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while updating the user to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
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
    const foundUser = await UserModel.findById(userId);

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

    const userStatus = foundUser.isAcceptingMessage;

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status retreived succesfully ",
        isAcceptingMessages: userStatus,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
