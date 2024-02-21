"use client";


import { useEffect, useState } from "react";

import { CreateRoomModal } from "@/components/modals/create-room-modal";
import { InviteModal } from "../modals/invite-modal";
import { EditRoomModal } from "../modals/edit-room-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/creaete-channel-modal";
import { LeaveRoomModal } from "../modals/leave-room-modal";
import { DeleteRoomModal } from "../modals/delete-room-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { MessageFileModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  // Vracas sve modale, ali nijedan se nece prikazivati ako ne treba (po defaultu im je open=false na komponenti koju vracaju i slicno, pa se ovo sa onClick menja)
  return (
    <>
      <CreateRoomModal />
      <InviteModal />
      <EditRoomModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveRoomModal />
      <DeleteRoomModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}