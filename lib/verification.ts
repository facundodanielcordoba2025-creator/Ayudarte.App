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
export function calculateVerificationStars(userOrSocials?: any): number {
  if (!userOrSocials) return 0;
  const socials: UserSocials | undefined = userOrSocials.socials || userOrSocials;
  if (!socials || typeof socials !== "object") return 0;

  let stars = 0;
  if (socials.whatsapp?.value?.trim() && socials.whatsapp.visible) stars++;
  if (socials.instagram?.value?.trim() && socials.instagram.visible) stars++;
  if (socials.facebook?.value?.trim() && socials.facebook.visible) stars++;
  if (socials.tiktok?.value?.trim() && socials.tiktok.visible) stars++;
  if (socials.email?.value?.trim() && socials.email.visible) stars++;
  return stars;
}

export function isProfileVerified(userOrSocials?: any): boolean {
  return calculateVerificationStars(userOrSocials) >= 3;
}

/**
 * Convierte cualquier identificador ingresado (handle @usuario, número de teléfono, o link pegado)
 * en un enlace 100% funcional y directo hacia la red social correspondiente.
 */
export function getSocialUrl(channel: "whatsapp" | "instagram" | "facebook" | "tiktok" | "email", value: string): string {
  let clean = value.trim();
  if (!clean) return "";

  if (channel === "whatsapp") {
    // Limpiar caracteres no numéricos
    let digits = clean.replace(/\D/g, "");
    
    // Si empieza con 0 (ej. 011 15...), quitar el 0 inicial
    if (digits.startsWith("0")) {
      digits = digits.substring(1);
    }
    // Si tiene 10 dígitos (ej. 11 1234 5678 típico de celular en Argentina), agregar código de país 549
    if (digits.length === 10) {
      digits = `549${digits}`;
    } else if (digits.length === 11 && digits.startsWith("9")) {
      digits = `54${digits}`;
    } else if (digits.startsWith("54") && !digits.startsWith("549") && digits.length === 12) {
      // Si pusieron 54 11..., WhatsApp Argentina requiere 54 9 11...
      digits = `549${digits.substring(2)}`;
    }

    return `https://wa.me/${digits}`;
  }

  if (channel === "instagram") {
    // Si pegaron la URL completa con o sin https
    clean = clean.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "");
    clean = clean.replace(/^@/, "").replace(/\/+$/, "");
    return `https://instagram.com/${encodeURIComponent(clean)}`;
  }

  if (channel === "tiktok") {
    clean = clean.replace(/^(https?:\/\/)?(www\.)?tiktok\.com\//i, "");
    clean = clean.replace(/^@/, "").replace(/\/+$/, "");
    return `https://tiktok.com/@${encodeURIComponent(clean)}`;
  }

  if (channel === "facebook") {
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    clean = clean.replace(/^(www\.)?facebook\.com\//i, "").replace(/\/+$/, "");
    return `https://facebook.com/${clean.replace(/\s+/g, ".")}`;
  }

  if (channel === "email") {
    clean = clean.replace(/^mailto:/i, "");
    return `mailto:${clean}`;
  }

  return clean;
}
