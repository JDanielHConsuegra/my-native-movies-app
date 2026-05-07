import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "react-native-url-polyfill/auto";
import "../globals.css";

export default function RootLayout() {
  return (
    <>
      {/* Coloca el StatusBar aquí, fuera del Stack */}
      <StatusBar hidden={true} />

      <AuthProvider>
        <FavoritesProvider>
          <Stack>
            {/* AQUÍ SOLO PUEDEN IR SCREENS */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </FavoritesProvider>
      </AuthProvider>
    </>
  );
}