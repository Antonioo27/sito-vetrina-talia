import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * This is your Uploadthing File Router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 6, // Max 6 images per upload session
    },
  })
    // Set permissions and file-specific meta data for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`

      // You can throw new UploadThingError() to reject the upload
      // Placeholder: For now, allow all uploads (no auth check)
      // To add auth: const user = await auth(); if (!user) throw new UploadThingError("Unauthorized");

      return { uploadedBy: "anonymous" }; // Later: user.id
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.uploadedBy);
      console.log("file url", file.url);

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.uploadedBy, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
