"use client"


import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css"
// For showcasing the uploaded image with an X button for removal:
import { X, FileIcon } from "lucide-react";
import Image from "next/image";


interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage" // Based on core.ts
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    // For showcasing an uploaded image and removing it:
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
          <div className="relative h-20 w-20">
            <Image
                fill
                src={value}
                alt="Upload"
                className="rounded-full"
            />
            <button
              onClick={() => onChange("")}
              className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
    }
    
    // For file upload:
    return (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
        />
    )
}