import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";



export async function POST(
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const roomId = searchParams.get("roomId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!roomId) {
      return new NextResponse("Room ID missing", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }


    const room = await db.room.update({
        where: {
            id: roomId,
            members: {
            some: {
                profileId: profile.id,
                role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                }
            }
            }
        },
        data: {
            channels: {
            create: {
                profileId: profile.id,
                name,
                type,
            }
            }
        }
    });

    
    return NextResponse.json(room);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}