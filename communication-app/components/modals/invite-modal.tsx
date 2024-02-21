"use client";


import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

// Shadcn:
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Ikonice:
import { Check, Copy, RefreshCw } from "lucide-react";

// Axios:
import axios from "axios";



export const InviteModal = () => {
    const { type, data, isOpen, onOpen, onClose } = useModal();
    const origin = useOrigin();
  
    const isModalOpen = isOpen && type === "invite";
    const { room } = data;
  
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const inviteUrl = `${origin}/invite/${room?.inviteCode}`;
        
    
    // Poziva ga OnClick() dugmeta za kopiranje linka.
    const onCopy = () => {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
  
      // Tokom jedne sekunde drzimo stanje da je kopirano (ikonica stikliranog ce se nakon jedne sekunde vratiti na ikonicu za kopiranje)
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    };
  
    // Poziva ga OnClick() dugmeta za generisanje novog linka.
    const onNew = async () => {
      try {
        setIsLoading(true);
        const response = await axios.patch(`/api/rooms/${room?.id}/invite-code`);
  
        // Iznova otvaramo prozorce za invite kako bi se dovukli svezi podaci u promenljive.
        onOpen("invite", { room: response.data });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
  
          <div className="p-6">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Room invite link
            </Label>
  
            <div className="flex items-center mt-2 gap-x-2">
              <Input
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                value={inviteUrl}
              />
  
              <Button disabled={isLoading} onClick={onCopy} size="icon">
                {copied  ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} 
              </Button>
            </div>
  
            <Button
              onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 mt-4"
            >
              Generate a new link
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }