import { z } from "zod";
import { contactSubjects } from "@/lib/contact/subjects";
import {
  emailField,
  nameField,
  optional,
  phoneField,
} from "@/lib/validation/fields";

export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  phone: optional(phoneField),
  subject: z.enum(contactSubjects, "Please choose a subject."),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(2000, "Please keep your message under 2000 characters."),
  newsletter: z.boolean(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
