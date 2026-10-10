import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ayudarte.app.app',
  appName: 'Ayudarte.App',
  webDir: 'out',
  server: {
    url: 'https://www.ayudarte.app',
    cleartext: true
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
