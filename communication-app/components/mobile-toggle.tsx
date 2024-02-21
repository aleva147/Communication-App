import { Menu } from "lucide-react"

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { RoomSidebar } from "@/components/room/room-sidebar";

import { Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


export const MobileToggle = ({
  roomId
}: {
  roomId: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          {/* Menu je samo ikonica... */}
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 flex gap-0">
        <RoomSidebar roomId={roomId} />
      </SheetContent>
    </Sheet>
  )
}