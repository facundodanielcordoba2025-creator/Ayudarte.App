#!/bin/bash
set -e

echo "1. Generating Android App Icons (Mipmaps)..."
ICON_SRC="public/icon_transparent.png"
RES="android/app/src/main/res"

# mipmap-mdpi (48x48)
sips -z 48 48 "$ICON_SRC" --out "$RES/mipmap-mdpi/ic_launcher.png"
sips -z 48 48 "$ICON_SRC" --out "$RES/mipmap-mdpi/ic_launcher_round.png"
sips -z 108 108 "$ICON_SRC" --out "$RES/mipmap-mdpi/ic_launcher_foreground.png"

# mipmap-hdpi (72x72)
sips -z 72 72 "$ICON_SRC" --out "$RES/mipmap-hdpi/ic_launcher.png"
sips -z 72 72 "$ICON_SRC" --out "$RES/mipmap-hdpi/ic_launcher_round.png"
sips -z 162 162 "$ICON_SRC" --out "$RES/mipmap-hdpi/ic_launcher_foreground.png"

# mipmap-xhdpi (96x96)
sips -z 96 96 "$ICON_SRC" --out "$RES/mipmap-xhdpi/ic_launcher.png"
sips -z 96 96 "$ICON_SRC" --out "$RES/mipmap-xhdpi/ic_launcher_round.png"
sips -z 216 216 "$ICON_SRC" --out "$RES/mipmap-xhdpi/ic_launcher_foreground.png"

# mipmap-xxhdpi (144x144)
sips -z 144 144 "$ICON_SRC" --out "$RES/mipmap-xxhdpi/ic_launcher.png"
sips -z 144 144 "$ICON_SRC" --out "$RES/mipmap-xxhdpi/ic_launcher_round.png"
sips -z 324 324 "$ICON_SRC" --out "$RES/mipmap-xxhdpi/ic_launcher_foreground.png"

# mipmap-xxxhdpi (192x192)
sips -z 192 192 "$ICON_SRC" --out "$RES/mipmap-xxxhdpi/ic_launcher.png"
sips -z 192 192 "$ICON_SRC" --out "$RES/mipmap-xxxhdpi/ic_launcher_round.png"
sips -z 432 432 "$ICON_SRC" --out "$RES/mipmap-xxxhdpi/ic_launcher_foreground.png"

echo "2. Generating Android Splash Screens (Drawables)..."
SPLASH_SRC="/tmp/splash_preview.png"

# Default splash
sips -z 1920 1080 "$SPLASH_SRC" --out "$RES/drawable/splash.png"

# Portrait
sips -z 480 320 "$SPLASH_SRC" --out "$RES/drawable-port-mdpi/splash.png"
sips -z 800 480 "$SPLASH_SRC" --out "$RES/drawable-port-hdpi/splash.png"
sips -z 1280 720 "$SPLASH_SRC" --out "$RES/drawable-port-xhdpi/splash.png"
sips -z 1600 960 "$SPLASH_SRC" --out "$RES/drawable-port-xxhdpi/splash.png"
sips -z 1920 1280 "$SPLASH_SRC" --out "$RES/drawable-port-xxxhdpi/splash.png"

# Landscape
sips -p 1080 1920 --padColor FFFFFF "$ICON_SRC" --out /tmp/splash_land.png
sips -z 320 480 /tmp/splash_land.png --out "$RES/drawable-land-mdpi/splash.png"
sips -z 480 800 /tmp/splash_land.png --out "$RES/drawable-land-hdpi/splash.png"
sips -z 720 1280 /tmp/splash_land.png --out "$RES/drawable-land-xhdpi/splash.png"
sips -z 960 1600 /tmp/splash_land.png --out "$RES/drawable-land-xxhdpi/splash.png"
sips -z 1280 1920 /tmp/splash_land.png --out "$RES/drawable-land-xxxhdpi/splash.png"

# 512x512 Store icon for Google Play Console
sips -z 512 512 "$ICON_SRC" --out "public/playstore-icon-512.png"

echo "Done! All Android icons and splash screens generated successfully."
