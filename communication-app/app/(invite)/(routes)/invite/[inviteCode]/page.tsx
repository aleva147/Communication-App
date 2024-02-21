import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";


interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};


const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }


  // Ako ulogovan korisnik vec pripada trazenoj sobi, samo ucitamo stranicu sobe. 
  //    U suprotnom ga dodamo kao novog membera toj sobi (po defaultu je tipa guest)
  const existingRoom = await db.room.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingRoom) {
    return redirect(`/rooms/${existingRoom.id}`);
  }

  const room = await db.room.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });


  if (room) {
    return redirect(`/rooms/${room.id}`);
  }
  
  return null;
}
 
export default InviteCodePage;