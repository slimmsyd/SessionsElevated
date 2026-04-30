// Owner priority: drive every active RSVP click to the on-site /book checkout flow.

export const LINKS = {
  // Current event - May 24, 2026 - Spring Awakening (self-hosted booking flow)
  rsvp: "/book",
  eventPage: "https://events.eventnoire.com/e/elevatedblossom20-2",

  // Past events
  pastWinter:
    "https://events.eventnoire.com/e/elevatedwinter20?utm_source=promoter&utm_id=68c097b895384aeaa51303a10a1e606a",
  pastBreatheAndBlow: "https://events.eventnoire.com/e/elevatedbreatheandblow",
} as const;
