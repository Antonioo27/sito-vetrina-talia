import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Schema for contact form
const contactInputSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  email: z.string().email("Email non valida"),
  subject: z.string().min(1, "L'oggetto è obbligatorio"),
  message: z.string().min(10, "Il messaggio deve contenere almeno 10 caratteri"),
});

export const contactRouter = createTRPCRouter({
  // Send contact form email
  sendMessage: publicProcedure
    .input(contactInputSchema)
    .mutation(async ({ input }) => {
      // In a real application, you would use a service like SendGrid, Nodemailer, etc.
      // For now, we'll just store it in the database or log it

      // TODO: Implement actual email sending
      // You can use: nodemailer, sendgrid, or your email service of choice

      console.log("[CONTACT] New message from:", {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });

      // Simulate a successful submission
      return {
        success: true,
        message: "Messaggio inviato con successo! Ti contatteremo presto.",
      };
    }),
});
