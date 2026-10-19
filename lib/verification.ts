export interface UserSocialChannel {
  value: string;
  visible: boolean;
}

export interface UserSocials {
  whatsapp?: UserSocialChannel;
  instagram?: UserSocialChannel;
  facebook?: UserSocialChannel;
  tiktok?: UserSocialChannel;
  email?: UserSocialChannel;
}

/**
 * Cada canal con valor y marcado como visible suma 1 estrella (de 0 a 5).
 * Al alcanzar al menos 3 estrellas, se obtiene la insignia oficial de "Perfil Verificado".
 */
export function calculateVerificationStars(socials?: UserSocials): number {
  if (!socials) return 0;
  let stars = 0;
  if (socials.whatsapp?.value?.trim() && socials.whatsapp.visible) stars++;
  if (socials.instagram?.value?.trim() && socials.instagram.visible) stars++;
  if (socials.facebook?.value?.trim() && socials.facebook.visible) stars++;
  if (socials.tiktok?.value?.trim() && socials.tiktok.visible) stars++;
  if (socials.email?.value?.trim() && socials.email.visible) stars++;
  return stars;
}

export function isProfileVerified(socials?: UserSocials): boolean {
  return calculateVerificationStars(socials) >= 3;
}

/**
 * Convierte un identificador ingresado (ej. @usuario o link completo) en una URL válida.
 */
export function getSocialUrl(channel: "whatsapp" | "instagram" | "facebook" | "tiktok" | "email", value: string): string {
  const clean = value.trim();
  if (!clean) return "";

  if (channel === "whatsapp") {
    const phoneDigits = clean.replace(/\D/g, "");
    return `https://wa.me/${phoneDigits}`;
  }

  if (channel === "instagram") {
    if (clean.startsWith("http")) return clean;
    const handle = clean.replace(/^@/, "");
    return `https://instagram.com/${handle}`;
  }

  if (channel === "tiktok") {
    if (clean.startsWith("http")) return clean;
    const handle = clean.startsWith("@") ? clean : `@${clean}`;
    return `https://tiktok.com/${handle}`;
  }

  if (channel === "facebook") {
    if (clean.startsWith("http")) return clean;
    return `https://facebook.com/${clean.replace(/\s+/g, ".")}`;
  }

  if (channel === "email") {
    return `mailto:${clean}`;
  }

  return clean;
}
