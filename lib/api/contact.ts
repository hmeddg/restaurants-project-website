import "server-only";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ContactInput } from "@/lib/contact/schema";

export async function sendContactMessage(input: ContactInput) {
  await apiRequest(endpoints.contactMessages, {
    method: "POST",
    body: input,
    cache: "no-store",
  });
}
