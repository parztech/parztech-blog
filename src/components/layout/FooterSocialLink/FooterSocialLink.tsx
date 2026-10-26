import { SocialIcon } from "@/features/share/components/SocialIcon";
import { cn } from "@/lib/utils";

import type { FooterSocialLinkProps } from "./types";

export default function FooterSocialLink({
  href,
  icon,
  className,
  iconClassName,
  children,
}: FooterSocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors",
        className,
      )}
    >
      <SocialIcon network={icon} className={iconClassName} />
      {children}
    </a>
  );
}
