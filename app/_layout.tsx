// app/_layout.tsx
import { Stack, Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./AuthContext"; // Assure-toi que le chemin est correct

export default function RootLayout() {
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Slot />
			</Stack>
			<Toast />
		</AuthProvider>
	);
}
