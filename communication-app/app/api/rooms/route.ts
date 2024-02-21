import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";


export async function POST(req: Request) {
    try {
        // Sakupi podatke za sobu iz forme (preneti su kao parametri POST zahteva, req.json() za dohvatanje) i dohvati Profile Model ulogovanog korisnika iz baze:
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        // Napravi novu sobu u bazi: 
        //  'name,' je isto kao da si napisao 'name: name'
        //  'inviteCode: uuidv4()' ce generisati nasumican inviteCode.
        const room = await db.room.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });


        return NextResponse.json(room);

    } catch (error) {
        console.log("Error in rooms post", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 
