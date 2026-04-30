export type Session = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  doors: string;
  location: string;
  poster: string;
};

export const CURRENT_SESSION: Session = {
  id: "spring-awakening-2026",
  title: "Spring Awakening",
  subtitle: "A Journey into Renewal",
  date: "Sunday, May 24, 2026",
  time: "10:00 AM – 2:00 PM",
  doors: "Doors open at 9:00 AM",
  location: "The Glasshouse · 4220 Dupont Cir NW, Washington, DC",
  poster: "/assets/sessions/winter-ground-seed.png",
};
