import type { CapacitorConfig } from '@capacitor/cli';

// Config de Capacitor para empaquetar la PWA de FACUTEAYUDA como app Android.
// webDir apunta a la carpeta que genera `next build` en modo export ("out").
const config: CapacitorConfig = {
  appId: 'com.facuteayuda.app',
  appName: 'FACUTEAYUDA',
  webDir: 'out',
  android: {
    allowMixedContent: false,
  },
  server: {
    // androidScheme "https" evita problemas con cookies/storage de Firebase Auth
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#0F1115',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
