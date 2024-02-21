import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@radix-ui/react-scroll-area";


// Prikazi sidebar (panel) na gornjoj ivici ekrana. Sidebar ce imati sobe, theme-mode i account settings.
export const NavigationSidebar = async () => {
  // Dohvati Profile ulogovanog iz baze:
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }


  // Dohvati sve sobe gde je ulogovani korisnik member:
  const rooms = await db.room.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });


  return (
    <div
      className="h-full w-full py-3 space-x-4 flex text-primary bg-[#E3E5E8] dark:bg-[#1E1F22]"
    >
      <NavigationAction />

      <Separator
        className="h-10 w-[2px] my-auto bg-zinc-300 dark:bg-zinc-700 rounded-md"
      />

      <ScrollArea className="flex-1 w-full">
        <div className="flex w-full space-x-4">
            {rooms.map((room) => (
                <div key={room.id} className="ml-2">
                    <NavigationItem
                    id={room.id}
                    name={room.name}
                    imageUrl={room.imageUrl}
                    />
                </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="pr-3 ml-auto flex items-center gap-x-4">
        <ModeToggle />
        
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  )
}