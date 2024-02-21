import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";



interface RoomIdPageProps {
  params: {
    roomId: string;
  }
};

const RoomIdPage = async ({ params }: RoomIdPageProps) => {

  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }


  const room = await db.room.findUnique({
    where: {
      id: params.roomId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })


  const initialChannel = room?.channels[0];

  // Ovo ne bi trebalo nikad da se desi.
  if (initialChannel?.name !== "general") {
    return null;
  }


  return redirect(`/rooms/${params.roomId}/channels/${initialChannel?.id}`)
}
 

export default RoomIdPage;