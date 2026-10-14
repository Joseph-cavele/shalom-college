import { FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { cn, waLink } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

/**
 * Facebook, TikTok and WhatsApp icons (the only social links on the site).
 * Facebook/TikTok URLs come from Settings → Social Media; until one is set its
 * icon is still shown but doesn't navigate anywhere.
 */
export function SocialLinks({
  settings,
  className,
  itemClassName,
  iconClassName = "h-4 w-4",
}: {
  settings: SiteSettings;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}) {
  const links = [
    { label: "Facebook", href: settings.facebook, Icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktok, Icon: FaTiktok },
    { label: "WhatsApp", href: settings.whatsapp ? waLink(settings.whatsapp) : "", Icon: FaWhatsapp },
  ];

  return (
    <span className={cn("flex items-center", className)}>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href || "#"}
          aria-label={label}
          title={label}
          {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={itemClassName}
        >
          <Icon className={iconClassName} aria-hidden />
        </a>
      ))}
    </span>
  );
}
