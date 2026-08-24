# FACUTEAYUDA

Base del proyecto: **Web + PWA + App Android**, un solo código fuente (Next.js
+ Firebase), compartiendo backend, usuarios e historias entre las tres
experiencias.

## Qué incluye esta base

- **Next.js 16 (App Router, TypeScript, Tailwind v4)** — mismo código sirve
  la web (`facuteayuda.com`) y la PWA.
- **PWA lista para instalar**: `app/manifest.ts` genera el manifest, y hay
  un service worker (`public/sw.js`) con app-shell offline y manejo de
  notificaciones push.
- **Capacitor configurado** (`capacitor.config.ts`) para empaquetar la app
  como proyecto Android nativo → `.apk` / `.aab`.
- **Firebase client SDK** (`lib/firebase.ts`): Auth, Firestore y Storage
  listos para usar, leyendo config desde variables de entorno.
- **Navegación inferior** (Inicio, Historias, Mi sueño, Ayudar, Perfil) con
  el botón flotante **CONTAR MI SUEÑO**, tal como pide la especificación.
- Sistema de diseño propio (paleta "cielo nocturno cálido": azul-noche +
  ámbar + coral) en `app/globals.css`, no un template genérico.
- Íconos placeholder de la app en `public/icons/` (reemplazar antes de
  publicar).

## Cómo está pensada la arquitectura (por qué no se duplica lógica)

Un mismo build de Next.js se usa en dos modos:

| Modo | Comando | Qué genera | Dónde vive |
|---|---|---|---|
| **Web** | `npm run build` | Server Next.js normal (SSR, rutas dinámicas como `/sueno/[id]`) | Vercel / Firebase Hosting → `facuteayuda.com` |
| **Android** | `npm run cap:sync` | Export estático (`/out`) empaquetado por Capacitor | APK/AAB para Google Play |

Los dos modos comparten componentes, páginas y lógica. La app Android habla
directo con Firebase (Auth/Firestore/Storage) usando el SDK cliente, por eso
no depende de tener corriendo el server de Next para funcionar.

La PWA (instalable desde el navegador) usa el modo **Web** directamente:
mismo dominio, mismo login, mismos datos que la versión Android.

## Primeros pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el proyecto de Firebase

1. Ir a console.firebase.google.com → crear proyecto "FACUTEAYUDA".
2. Activar **Authentication** (método Email/Password y/o Google).
3. Crear base de datos **Cloud Firestore** (modo producción).
4. Activar **Storage** (para fotos y videos de las historias).
5. Activar **Cloud Messaging** (para las notificaciones push) y generar una
   clave VAPID (Configuración del proyecto → Cloud Messaging → Certificados
   push web).
6. Registrar una app **Web** dentro del proyecto de Firebase y copiar la
   config.

Copiar `.env.local.example` a `.env.local` y completar con esos datos:

```bash
cp .env.local.example .env.local
```

### 3. Correr en modo desarrollo (web/PWA)

```bash
npm run dev
```

Abrir `http://localhost:3000`.

### 4. Agregar la plataforma Android

```bash
npm run cap:add:android
```

Esto crea la carpeta `/android` (proyecto nativo Android Studio). Después,
para cada nueva build:

```bash
npm run cap:sync          # build estático de Next + sincroniza con /android
npm run cap:open:android  # abre el proyecto en Android Studio
```

Antes de compilar, en Firebase Console → Configuración del proyecto → Tus
apps → agregar app **Android** con `applicationId com.facuteayuda.app`,
descargar `google-services.json` y colocarlo en `android/app/`.

### 5. Generar APK (pruebas) / AAB (Google Play)

Desde Android Studio: **Build → Generate Signed Bundle / APK**.

- Para pruebas internas: generar **APK**.
- Para publicar: generar **AAB** (Android App Bundle), firmado con tu
  keystore de producción.

## Pendiente antes de producción / publicación en Google Play

- [ ] Reemplazar los íconos placeholder (`public/icons/`) por el ícono
      final de marca (192px, 512px, y versión maskable).
- [ ] Crear pantalla de splash nativa para Android (`@capacitor/splash-screen`
      ya está referenciado en `capacitor.config.ts`, falta el asset).
- [ ] Escribir política de privacidad y términos y condiciones (obligatorio
      para Google Play), y agregar sus URLs en el Perfil.
- [ ] Implementar **eliminación de cuenta** desde la app (obligatorio desde
      2023 en Google Play si la app permite crear cuenta).
- [ ] Cargar ficha de Google Play: descripción corta/larga, screenshots,
      clasificación de contenido.
- [ ] Implementar reglas de seguridad de Firestore/Storage (quién puede leer
      y escribir cada colección).
- [ ] Conectar Firebase Cloud Messaging real (pedir permiso de notificación,
      guardar el token FCM del usuario, enviar desde el panel admin).
- [ ] Implementar deep links (`facuteayuda.com/sueno/123` → abre la app si
      está instalada) con Android App Links / Capacitor deep linking.
- [ ] Panel administrativo (moderación de historias, envío de
      notificaciones, gestión de empresas padrino).

## Estructura de carpetas

```
app/                  # Rutas (App Router) — páginas de la web/PWA/app
  manifest.ts          # Manifest PWA
  layout.tsx            # Layout raíz (fonts, PWA meta, nav)
  page.tsx               # Inicio
  historias/ mi-sueno/ ayudar/ perfil/ contar-mi-sueno/  # Secciones de la nav
components/
  BottomNav.tsx          # Navegación inferior + botón "CONTAR MI SUEÑO"
  ServiceWorkerRegister.tsx
lib/
  firebase.ts             # Firebase client SDK (auth, firestore, storage)
public/
  sw.js                    # Service worker (offline + push)
  icons/                    # Íconos de la PWA/app
capacitor.config.ts          # Config de empaquetado Android
```
