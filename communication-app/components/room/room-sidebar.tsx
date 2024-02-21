import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

import { ChannelType } from "@prisma/client";

import { RoomHeader } from "./room-header";
import { RoomSearch } from "./room-search";
import { RoomSection } from "./room-section";
import { RoomChannel } from "./room-channel";
import { RoomMember } from "./room-member";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";




interface RoomSidebarProps {
  roomId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

// const roleIconMap = {
//   [MemberRole.GUEST]: null,
//   [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
//   [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
// }


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

  // Uloga ulogovanog korisnika u sobi (upitnik mora jer se okruzenje buni ali mi svakako znamo da ce biti pronadjen ulogovan korisnik na izabranoj sobi (ne bi mogao da ga izabere u suprotnom))
  const role = room.members.find((member) => member.profileId === profile.id)?.role;

  
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <RoomHeader
        room={room}
        role={role}
      />

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <RoomSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: iconMap[ChannelType.AUDIO]
                  // icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <RoomChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  room={room}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <RoomChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  room={room}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <RoomChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  room={room}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType="members"
              role={role}
              label="Members"
              room={room}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <RoomMember
                  key={member.id}
                  member={member}
                  room={room}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}