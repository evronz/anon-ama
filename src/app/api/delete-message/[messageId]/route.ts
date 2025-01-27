import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = await params.messageId;

  console.log({ messageId });

  return NextResponse.json({
    success: "Failed",
    message: "Request to delete accepted.",
  });
}
