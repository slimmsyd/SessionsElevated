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
