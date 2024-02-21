"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

// Shadcn:
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

// Zod:
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Axios:
import axios from "axios";



const formSchema = z.object({
  name: z.string().min(1, {
    message: "Room name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Room image is required."
  })
});


export const EditRoomModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editRoom";
  const { room } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  // Da se popuni forma sa slikom izabrane sobe i imenom izabrane sobe.
  useEffect(() => {
    if (room) {
      form.setValue("name", room.name);
      form.setValue("imageUrl", room.imageUrl);
    }
  }, [room, form]);


  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/rooms/${room?.id}`, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Customize your room
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Give your room a personality with a name and an image. <br/> (you can always change this later)
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Room name
                                    </FormLabel>
                                    
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter room name"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                    </div>

                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button variant="primary" disabled={isLoading}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
)
}