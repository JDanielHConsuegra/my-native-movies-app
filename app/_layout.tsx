import "react-native-url-polyfill/auto";

import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "../globals.css";

export default function RootLayout() {
  
  return <>
  <StatusBar hidden={true} />
  <AuthProvider>
  <FavoritesProvider>
  <Stack>
    <StatusBar hidden/>
    <Stack.Screen
    name="(tabs)"
    options={{
      headerShown: false
    }} 
    />
    <Stack.Screen
    name="movies/[id]"
    options={{
      headerShown: false
    }}
    />
    <Stack.Screen
    name="onboarding"
    options={{
      headerShown: false
    }}
    />
    <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
    <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
  </Stack>
     </FavoritesProvider>
     </AuthProvider>
 </>
}
