import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";



export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const room = await db.room.update({
        where: {
            id: params.roomId,
            profileId: profile.id,
        },
        data: {
            name,
            imageUrl,
        }
    });


    return NextResponse.json(room);
  }
  catch (error) {
    console.log("[ROOM_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
    req: Request,
    { params }: { params: { roomId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
    }


    const room = await db.room.delete({
        where: {
            id: params.roomId,
            profileId: profile.id,
        }
    });


    return NextResponse.json(room);
  } 
  catch (error) {
    console.log("[ROOM_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}