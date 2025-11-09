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
    label: "Catalogo",
    href: "/catalogo",
    description: "Scopri il nostro catalogo",
  },
];

export type MenuItem = (typeof mainMenu)[0];
