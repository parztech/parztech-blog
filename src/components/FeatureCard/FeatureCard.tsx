import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { FeatureCardProps } from "./types";

export default function FeatureCard({
  icon: Icon,
  title,
  text,
  tint,
}: FeatureCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div
          className={cn(
            "mb-2 grid size-11 place-items-center rounded-xl",
            tint,
          )}
        >
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">{text}</CardDescription>
      </CardContent>
    </Card>
  );
}
