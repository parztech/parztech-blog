import type { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Background and text color classes for the icon tile */
  tint: string;
};
