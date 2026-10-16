import { routes } from "@/lib/routes";

export const siteConfig = {
  name: "Parz Tech",
  tagline: "Տեխնոլոգիաներ և ՍԻ (արհեստական բանականություն)՝ պարզ լեզվով",
  description:
    "Parz Tech-ը հայալեզու բլոգ է տեխնոլոգիաների և արհեստական բանականության (ՍԻ) մասին՝ բացատրված պարզ ու հասկանալի։",
  /** Other names people search for; listed in structured data for Google */
  alternateNames: ["Parz", "ParzTech", "Պարզ", "Պարզ Թեք"],
  locale: "hy_AM",
  author: "Թամարա Մարտիրոսյան",
  /** Shown on the partnerships page */
  contact: {
    email: "tamara.martirosyan.93@gmail.com",
    /** Personal Telegram username without "@"; the Telegram button is hidden while empty */
    telegram: "",
  },
  nav: [
    { title: "Գլխավոր", href: routes.home },
    { title: "Բլոգ", href: routes.blog },
    { title: "Իմ մասին", href: routes.about },
  ],
  /** Footer-only links: pages meant for partners rather than readers */
  footerNav: [{ title: "Համագործակցություն", href: routes.partners }],
} as const;

export const siteTitle = `${siteConfig.name} | ${siteConfig.tagline}`;

export const authorInitials = siteConfig.author
  .split(" ")
  .map((part) => part[0])
  .join("");
