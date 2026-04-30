// GA4 click tracking. All RSVP CTAs route through trackRsvp() so we can see
// which placement drives the most conversions (Reports > Events > rsvp_click in GA).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type RsvpLocation =
  | "nav_desktop"
  | "nav_mobile"
  | "hero_bottom_rail"
  | "sticky_reserve"
  | "session_row_spring"
  | "session_row_winter_closed"
  | "session_row_fall_closed"
  | "faq_bottom"
  | "footer_button"
  | "footer_link";

export function trackRsvp(location: RsvpLocation, destinationUrl: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "rsvp_click", {
    rsvp_location: location,
    destination_url: destinationUrl,
  });
}

// Booking funnel events on /book. Reports > Events > booking_* in GA4.
export type BookingEvent =
  | { name: "booking_step_view"; step: number; mode: "admission" | "partnership" }
  | { name: "booking_tier_change"; tier_id: string; qty: number }
  | { name: "booking_submit_attempt"; step: number }
  | { name: "booking_complete"; subtotal: number; total: number; tier_count: number };

export function trackBooking(event: BookingEvent) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const { name, ...params } = event;
  window.gtag("event", name, params);
}
