// Keep in sync with backend/app/schemas/reservation.py and backend/.env.
export const slotTimes = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
] as const;

export const minGuests = 1;
// Parties of 8 or more book by phone.
export const maxGuests = 7;
export const bookingWindowDays = 60;
export const holdMinutes = 15;

export const occasions = [
  "Birthday",
  "Anniversary",
  "Date night",
  "Business dinner",
  "Celebration",
  "Other",
] as const;
