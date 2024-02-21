import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";



const SetupPage = async () => {
    const profile = await initialProfile();

    // Radimo pretragu nad svim sobama i vracamo prvu na koju naidjemo da je ulogovan korisnik njen member
    const room = await db.room.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    // Prikazujemo stranicu te sobe ako smo nasli bar jednu sobu kojoj pripada korisnik
    if (room) {
        return redirect(`/rooms/${room.id}`);
    }

    // Ako ulogovan korisnik nije pripadao nijednoj sobi, prikazujemo stranicu za kreiranje sobe (to je ista ova tekuca stranica, samo sada sa Modalom za kreiranje sobe)
    return <InitialModal />
}

export default SetupPage;