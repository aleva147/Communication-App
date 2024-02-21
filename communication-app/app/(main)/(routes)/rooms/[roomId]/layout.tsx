import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { RoomSidebar } from "@/components/room/room-sidebar";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


// Params je objekat koji u sebi sadrzi sve delove url-a.
//  Sa sigurnoscu znas da ce url sadrzati roomId jer si folder nazvao [roomId], deo je putanje.
const RoomIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) => {

  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }


  // Vrsimo i proveru da ulogovan korisnik pripada toj sobi, jer u suprotnom bi bilo koja osoba koja
  //    zna odnekud url sobe mogla da ga ukuca i vidi sadrzaj sobe (kanale, membere...) kao da je clan.
  const room = await db.room.findUnique({
    where: {
      id: params.roomId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  // Soba je obrisana ili ulogovan korisnik ne pripada toj sobi.
  if (!room) {
    return redirect("/");
  }


  // RoomSidebar je jos jedan navbar (panel duz cele visine ekrana) uz levu ivicu ekrana.
  return ( 
    <div className="h-full">
      <div 
      className="hidden md:flex h-full w-60 z-20 flex-col fixed">
        <RoomSidebar roomId={params.roomId} />
      </div>
      
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
   );
}
 
export default RoomIdLayout;