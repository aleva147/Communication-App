"use client";

import { useModal } from "@/hooks/use-modal-store";

import { RoomWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import { 
  ChevronDown, 
  LogOut, 
  PlusCircle, 
  Settings, 
  Trash, 
  UserPlus,
  Users
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface RoomHeaderProps {
  room: RoomWithMembersWithProfiles;
  role?: MemberRole;
};

export const RoomHeader = ({
  room,
  role
}: RoomHeaderProps) => {

  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;


  // ChevronDown, Users, Settings... su samo ikonice strelice nadole, coveculjka, zupcanika...
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {room.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {/* Samo moderator (time i admin) moze da vidi ovaj DropdownMenuItem */}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { room })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editRoom", { room })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Room Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { room })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}


        {isModerator && (
          <DropdownMenuSeparator />
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteRoom", { room })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Room
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Svi sem admina mogu da vidi ovaj Item, admin moze samo da obrise server, ne i da ga napusti */}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveRoom", { room })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Room
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}