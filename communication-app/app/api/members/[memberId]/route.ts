import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";



export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const roomId = searchParams.get("roomId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!roomId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }


    const room = await db.room.update({
        where: {
            id: roomId,
            profileId: profile.id,
        },
        data: {
            members: {
            update: {
                where: {
                id: params.memberId,
                profileId: {
                    not: profile.id // Niko ne moze sam sebi da promeni, samo admin moze drugima, ili moderator drugima sem adminu.
                }
                },
                data: {
                role
                }
            }
            }
        },
        include: {
            members: {
            include: {
                profile: true,
            },
            orderBy: {
                role: "asc"
            }
            }
        }
    });


    return NextResponse.json(room);
  } 
  catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const roomId = searchParams.get("roomId");

    if (!profile) {
    return new NextResponse("Unauthorized" ,{ status: 401 });
    }
    if (!roomId) {
    return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!params.memberId) {
    return new NextResponse("Member ID missing", { status: 400 });
    }


    const room = await db.room.update({
        where: {
            id: roomId,
            profileId: profile.id,
        },
        data: {
            members: {
            deleteMany: {
                id: params.memberId,
                profileId: {
                not: profile.id
                }
            }
            }
        },
        include: {
            members: {
            include: {
                profile: true,
            },
            orderBy: {
                role: "asc",
            }
            },
        },
    });


    return NextResponse.json(room);
  } 
  catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}