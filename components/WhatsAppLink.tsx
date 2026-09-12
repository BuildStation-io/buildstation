import { WHATSAPP_INVITE } from "@/lib/community";
import { WhatsAppMark } from "./WhatsAppMark";

type WhatsAppLinkProps = {
  label?: string;
  className?: string;
  iconClassName?: string;
};

export function WhatsAppLink({
  label = "WhatsApp",
  className,
  iconClassName = "h-4 w-4",
}: WhatsAppLinkProps) {
  return (
    <a
      href={WHATSAPP_INVITE}
      target="_blank"
      rel="noreferrer"
      data-goo-target
      data-goo-color="#25d366"
      className={className}
      aria-label="Join the BuildStation WhatsApp community"
    >
      <WhatsAppMark className={iconClassName} />
      {label ? <span>{label}</span> : null}
    </a>
  );
}
