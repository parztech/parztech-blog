import type { ReactNode } from "react";

import type { SocialIconProps } from "@/features/share/components/SocialIcon/types";

export type FooterSocialLinkProps = {
  href: string;
  icon: SocialIconProps["network"];
  /** Brand hover border, e.g. "hover:border-telegram" */
  className?: string;
  /** Brand icon color, e.g. "text-telegram" */
  iconClassName?: string;
  children: ReactNode;
};
