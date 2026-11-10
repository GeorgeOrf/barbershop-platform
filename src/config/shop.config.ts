export type Service = {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMin: number;
}

export type Barber = {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export type OpeningHours = {
  day: number;
  open: string | null;
  close: string | null;
}

export type ShopConfig = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl?: string;
  social: { instagram?: string; facebook?: string };
  theme: { primary: string; background: string };
  services: Service[];
  barbers: Barber[];
  hours: OpeningHours[];
}

export const shop: ShopConfig = {
  name: "Barberholic",
  tagline: "Fresh haircuts",
  phone: "2312955747",
  email: "georgios.orfanidis4@gmail.com",
  address: "Kassandrou 107",
  mapEmbedUrl: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.6184156620907!2d22.948019012517264!3d40.63829647128512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a83993b15c7e2b%3A0xd5f690f9fdee82f!2sBARBER%20HOLIC!5e0!3m2!1sel!2sgr!4v1793727416323!5m2!1sel!2sgr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`,
  social: { instagram: "@BARBERHOLIC", facebook: "BARBERHOLIC"},
  theme: { primary: "#fff", background: "#000"},
  services: [
    {
      id: "haircut",
      name: "Κούρεμα",
      price: 15,
      durationMin: 30,
    },
    {
      id: "haircut-beard",
      name: "Κούρεμα και μούσια",
      price: 20,
      durationMin: 45,
    },
    {
      id: "child-haircut",
      name: "Παιδικό Κούρεμα",
      price: 10,
      durationMin: 25,
    },
  ],
  barbers: [
    {
      id: "liakos",
      name: "Ηλίας",
      role: "Owner",
    }
  ],
  hours: [
    { day: 0, open: null, close: null},
    { day: 1, open: "09:00", close: "18:00"},
    { day: 2, open: "09:00", close: "18:00"},
    { day: 3, open: "09:00", close: "18:00"},
    { day: 4, open: "09:00", close: "18:00"},
    { day: 5, open: "09:00", close: "18:00"},
    { day: 6, open: null, close: null}
  ]
}