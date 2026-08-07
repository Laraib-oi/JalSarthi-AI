import type { FooterLinkGroup, NavLink } from "@/types";

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Features", href: "#features" },
      { label: "About", href: "#about" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Support", href: "#contact" },
      { label: "Report an Issue", href: "#contact" },
      { label: "Feedback", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Accessibility Statement", href: "#" },
    ],
  },
];
