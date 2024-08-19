// app/logout.tsx
import React, { useContext } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { AuthContext } from "../AuthContext"; // Assure-toi que le chemin est correct
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
	const { logout } = useContext(AuthContext);
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			Toast.show({
				type: "success",
				text1: "Déconnexion réussie",
				text2: "Vous avez été déconnecté.",
			});
			router.replace("/login");
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Erreur",
				text2: "Erreur lors de la déconnexion. Veuillez réessayer.",
			});
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Déconnexion</Text>
			<Button title="Se déconnecter" onPress={handleLogout} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 30,
	},
});
