import { buttonVariants } from "@/components/ui/button";
import { SocialIcon } from "@/features/share/components/SocialIcon";
import {
  TELEGRAM_CARD_TEXT,
  TELEGRAM_CARD_TITLE,
  TELEGRAM_JOIN_LABEL,
  TELEGRAM_NETWORK,
} from "@/features/telegram/constants";
import { telegramChannel } from "@/features/telegram/lib/channel";
import { cn } from "@/lib/utils";

/** "Join our channel" block at the end of a post; hidden until TELEGRAM_CHANNEL is set */
export default function TelegramCard() {
  if (!telegramChannel) return null;

  return (
    <section
      aria-label={TELEGRAM_CARD_TITLE}
      className="mt-6 flex flex-col items-center gap-5 rounded-3xl border bg-card p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left"
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-telegram text-white shadow-lg shadow-telegram/30">
          <SocialIcon network={TELEGRAM_NETWORK} className="size-5" />
        </div>
        <div>
          <p className="text-lg font-semibold">{TELEGRAM_CARD_TITLE}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {TELEGRAM_CARD_TEXT}
          </p>
        </div>
      </div>
      <a
        href={telegramChannel.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants(),
          "h-11 shrink-0 gap-2 rounded-full bg-telegram px-6 text-white shadow-lg shadow-telegram/30 transition hover:-translate-y-0.5 hover:bg-telegram hover:brightness-90",
        )}
      >
        <SocialIcon network={TELEGRAM_NETWORK} />
        {TELEGRAM_JOIN_LABEL}
      </a>
    </section>
  );
}
