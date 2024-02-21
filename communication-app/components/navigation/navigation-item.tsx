"use client";


import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";


// Ikonica sobe na sidebar-u.
interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
};

export const NavigationItem = ({ id, imageUrl, name } : NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();


  const onClick = () => {
    router.push(`/rooms/${id}`);
  }


  // Prvi div je bela linija na trenutno izabranoj ikonici sobe.
  // Drugi div cini trenutno izabranu ikonicu sobe drugacijeg oblika od ostalih.
  return (
    <ActionTooltip
      side="bottom"
      align="center"
      label={name}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div className={cn(
          "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
          params?.roomId !== id && "group-hover:h-[20px]",
          params?.roomId === id ? "h-[10px]" : "h-[0px]"
        )} />

        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.roomId === id && "bg-primary/10 text-primary rounded-[16px]"
        )}>
          <Image
            fill
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}