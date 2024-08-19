// app/login.tsx
import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "./AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useContext(AuthContext);
	const router = useRouter();

	const handleLogin = async () => {
		try {
			const response = await fetch("http://10.0.2.2:3000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				Toast.show({
					type: "error",
					text1: "Erreur",
					text2: `Erreur: ${errorData.error}`,
				});
				return;
			}

			const data = await response.json();
			await login(data.token);

			Toast.show({
				type: "success",
				text1: "Succès",
				text2: "Connexion réussie!",
			});
			router.push("/");
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Erreur",
				text2: "Erreur de connexion. Veuillez réessayer.",
			});
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Connexion</Text>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={styles.input}
				placeholderTextColor="#aaa"
			/>
			<TextInput
				placeholder="Mot de passe"
				value={password}
				onChangeText={setPassword}
				style={styles.input}
				secureTextEntry
				placeholderTextColor="#aaa"
			/>
			<Button title="Connexion" onPress={handleLogin} />
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
	input: {
		width: "100%",
		padding: 15,
		marginBottom: 20,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#fff",
		fontSize: 16,
	},
});
