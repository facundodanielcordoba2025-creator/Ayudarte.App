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

const BRAND_CONFIG = {
  whatsapp: { label: "WhatsApp", color: "text-[#25D366] hover:bg-[#25D366]/10", Icon: WhatsAppIcon },
  instagram: { label: "Instagram", color: "text-[#E4405F] hover:bg-[#E4405F]/10", Icon: InstagramIcon },
  facebook: { label: "Facebook", color: "text-[#1877F2] hover:bg-[#1877F2]/10", Icon: FacebookIcon },
  tiktok: { label: "TikTok", color: "text-cream hover:bg-cream/10", Icon: TikTokIcon },
  email: { label: "Email", color: "text-[#EA4335] hover:bg-[#EA4335]/10", Icon: EmailIcon },
};

export function SocialButtonsRow({ socials, className = "" }: SocialButtonsRowProps) {
  if (!socials) return null;

  const visibleList: { 
    key: keyof typeof BRAND_CONFIG; 
    url: string;
  }[] = [];

  if (socials.whatsapp?.value?.trim() && socials.whatsapp.visible) {
    visibleList.push({ key: "whatsapp", url: getSocialUrl("whatsapp", socials.whatsapp.value) });
  }
  if (socials.instagram?.value?.trim() && socials.instagram.visible) {
    visibleList.push({ key: "instagram", url: getSocialUrl("instagram", socials.instagram.value) });
  }
  if (socials.facebook?.value?.trim() && socials.facebook.visible) {
    visibleList.push({ key: "facebook", url: getSocialUrl("facebook", socials.facebook.value) });
  }
  if (socials.tiktok?.value?.trim() && socials.tiktok.visible) {
    visibleList.push({ key: "tiktok", url: getSocialUrl("tiktok", socials.tiktok.value) });
  }
  if (socials.email?.value?.trim() && socials.email.visible) {
    visibleList.push({ key: "email", url: getSocialUrl("email", socials.email.value) });
  }

  if (visibleList.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleList.map(({ key, url }) => {
        const config = BRAND_CONFIG[key];
        const Icon = config.Icon;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-xl flex items-center justify-center bg-surface-2 border border-line ${config.color} transition-all duration-200 active:scale-95 shadow-sm shrink-0`}
            title={config.label}
            aria-label={config.label}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
