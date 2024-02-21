import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { RoomHeader } from "./room-header";


interface RoomSidebarProps {
  roomId: string;
}


export const RoomSidebar = async ({
  roomId
}: RoomSidebarProps) => {
  
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }


  // U objekat const room inkludujemo sem Room Modela i kanale i membere da bismo prikazivali njihove informacije.
  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  if (!room) {
    return redirect("/");
  }
  

  const textChannels = room?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = room?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = room?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = room?.members.filter((member) => member.profileId !== profile.id) // Nema potrebe samog sebe da prikazujemo u listi.

  // Uloga ulogovanog korisnika na serveru (upitnik mora jer se okruzenje buni ali mi svakako znamo da ce biti pronadjen ulogovan korisnik na izabranom serveru (ne bi mogao da ga izabere u suprotnom))
  const role = room.members.find((member) => member.profileId === profile.id)?.role;

  
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <RoomHeader
        room={room}
        role={role}
      />
    </div>
  )
}