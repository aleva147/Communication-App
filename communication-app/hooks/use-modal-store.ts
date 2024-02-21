import { Channel, ChannelType, Room } from "@prisma/client";
import { create } from "zustand";


export type ModalType = "createRoom" | "invite" | "editRoom" | "members" | "createChannel" |  "leaveRoom" | "deleteRoom" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";;


// Bilo sta od ovoga moze da se prosledi kao podatak, ali ne mora, zato upitnik.
interface ModalData {
  room?: Room;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}


interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}


// create<> i set su iz Zustand bibilioteke.  
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));