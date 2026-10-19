"use client";

import { type UserSocials, getSocialUrl } from "@/lib/verification";
import { 
  WhatsAppIcon, 
  InstagramIcon, 
  FacebookIcon, 
  TikTokIcon, 
  EmailIcon 
} from "@/components/SocialIcons";

interface SocialButtonsRowProps {
  socials?: UserSocials;
  className?: string;
}

export function SocialButtonsRow({ socials, className = "" }: SocialButtonsRowProps) {
  if (!socials) return null;

  const visibleList: { 
    key: "whatsapp" | "instagram" | "facebook" | "tiktok" | "email"; 
    label: string; 
    url: string;
    Icon: (props: { className?: string }) => React.JSX.Element;
  }[] = [];

  if (socials.whatsapp?.value?.trim() && socials.whatsapp.visible) {
    visibleList.push({ 
      key: "whatsapp", 
      label: "WhatsApp", 
      url: getSocialUrl("whatsapp", socials.whatsapp.value),
      Icon: WhatsAppIcon 
    });
  }
  if (socials.instagram?.value?.trim() && socials.instagram.visible) {
    visibleList.push({ 
      key: "instagram", 
      label: "Instagram", 
      url: getSocialUrl("instagram", socials.instagram.value),
      Icon: InstagramIcon 
    });
  }
  if (socials.facebook?.value?.trim() && socials.facebook.visible) {
    visibleList.push({ 
      key: "facebook", 
      label: "Facebook", 
      url: getSocialUrl("facebook", socials.facebook.value),
      Icon: FacebookIcon 
    });
  }
  if (socials.tiktok?.value?.trim() && socials.tiktok.visible) {
    visibleList.push({ 
      key: "tiktok", 
      label: "TikTok", 
      url: getSocialUrl("tiktok", socials.tiktok.value),
      Icon: TikTokIcon 
    });
  }
  if (socials.email?.value?.trim() && socials.email.visible) {
    visibleList.push({ 
      key: "email", 
      label: "Email", 
      url: getSocialUrl("email", socials.email.value),
      Icon: EmailIcon 
    });
  }

  if (visibleList.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleList.map(({ key, label, url, Icon }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-2 hover:bg-star text-star hover:text-night border border-line hover:border-star transition-all duration-200 active:scale-95 shadow-sm shrink-0"
          title={label}
          aria-label={label}
        >
          <Icon className="w-4 h-4 fill-current" />
        </a>
      ))}
    </div>
  );
}
