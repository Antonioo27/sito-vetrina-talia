"use client";

import { useState } from "react";
import { UploadButton } from "~/utils/uploadthing";

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

export function ImageUpload({ onUploadComplete, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          if (res && res.length > 0) {
            setIsUploading(false);
            onUploadComplete?.(res[0]?.url ?? "");
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          onUploadError?.(error);
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
      />
    </div>
  );
}
