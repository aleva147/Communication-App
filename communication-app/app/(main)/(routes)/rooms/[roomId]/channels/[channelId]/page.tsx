import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
// import { MediaRoom } from "@/components/media-room";


// Znas da ces imati roomId i channelId unutar url zbog putanje do ovog fajla ([roomId], [channelId])
interface ChannelIdPageProps {
  params: {
    roomId: string;
    channelId: string;
  }
}


const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {

  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }


  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      roomId: params.roomId,
      profileId: profile.id,
    }
  });

  if (!channel || !member) {
    redirect("/");
  }


  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">

      <ChatHeader
        name={channel.name}
        roomId={channel.roomId}
        type="channel"
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              roomId: channel.roomId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              roomId: channel.roomId,
            }}
          />
        </>
      )}
      {/* {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )} */}
    </div>
   );
}
 

export default ChannelIdPage;