import type { ShareNetwork } from "@/features/share/types";

export type SocialIconProps = {
  network: Pick<ShareNetwork, "iconPath" | "iconFillRule">;
  className?: string;
};
