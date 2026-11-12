/*
 * Workshop booking — what the booking page collects, and the one place payment plugs in.
 *
 * TODO(z-commerce): workshops aren't z-commerce products yet (they live in src/data/classroom.ts).
 * Once they are, startBookingPayment should create the order for `seats` × the session's variant,
 * then pay exactly as checkout does: clientCheckout → openNimbblCheckout(token) → return its path.
 * Until then it returns null and the page shows a notice instead of taking payment.
 */

export interface BookingRequest {
  workshopSlug: string;
  /** WorkshopSession.startDate */
  session: string;
  seats: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Names for the extra seats, in desk order */
  guests: string[];
  /** "Have you written with a pointed pen before?" */
  experience: string;
  leftHanded: boolean;
  notes: string;
  /** The method the student picked; Nimbbl opens on it */
  paymentMethod: string;
  total: number;
}

/** Starts payment; resolves to the page to send the student to, or null while bookings aren't connected */
export async function startBookingPayment(booking: BookingRequest): Promise<string | null> {
  void booking;
  return null;
}
