export const mainMenu = [
  {
    label: "Home",
    href: "/",
    description: "Pagina principale",
  },
  {
    label: "Contatti",
    href: "/contatti",
    description: "Contattaci per informazioni",
  },
  {
    label: "Prodotti",
    href: "/prodotti",
    description: "Scopri i nostri prodotti",
  },
];

export type MenuItem = (typeof mainMenu)[0];
