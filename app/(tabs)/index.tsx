import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Définir l'interface pour un trajet
interface Trip {
	id: number;
	description: string;
}

export default function HomeScreen() {
	const [trips, setTrips] = useState<Trip[]>([]); // Utilisation de l'interface Trip pour le typage
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchTrips = async () => {
		try {
			setLoading(true);
			const token = await AsyncStorage.getItem("userToken"); // Récupération du token

			if (!token) {
				Toast.show({
					type: "error",
					text1: "Erreur",
					text2: "Utilisateur non authentifié.",
				});
				return;
			}

			const response = await fetch(
				`http://10.0.2.2:3000/api/trips?page=${page}&limit=5`,
				{
					headers: {
						Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
					},
				}
			);
			const data = await response.json();

			if (response.ok) {
				setTrips(data.trips);
				setTotalPages(data.totalPages);
			} else {
				Toast.show({
					type: "error",
					text1: "Erreur",
					text2: "Erreur lors de la récupération des trajets.",
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Erreur",
				text2: "Impossible de récupérer les trajets.",
			});
		} finally {
			setLoading(false);
		}
	};

	const joinTrip = (tripId: number) => {
		Toast.show({
			type: "success",
			text1: "Succès",
			text2: "Vous avez rejoint le trajet!",
		});
	};

	const leaveTrip = (tripId: number) => {
		Toast.show({
			type: "info",
			text1: "Info",
			text2: "Vous avez quitté le trajet.",
		});
	};

	useEffect(() => {
		fetchTrips();
	}, [page]);

	const renderTrip = ({ item }: { item: Trip }) => (
		<View style={styles.tripContainer}>
			<Text style={styles.tripText}>Trajet ID: {item.id}</Text>
			<Text style={styles.tripText}>Description: {item.description}</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => joinTrip(item.id)}
				>
					<Text style={styles.buttonText}>Rejoindre</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.leaveButton]}
					onPress={() => leaveTrip(item.id)}
				>
					<Text style={styles.buttonText}>Quitter</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator size="large" color="#1E90FF" />
			) : (
				<FlatList
					data={trips}
					renderItem={renderTrip}
					keyExtractor={(item) => item.id.toString()}
				/>
			)}
			<View style={styles.paginationContainer}>
				<TouchableOpacity
					style={styles.paginationButton}
					disabled={page === 1}
					onPress={() => setPage(page - 1)}
				>
					<Text style={styles.paginationButtonText}>Précédent</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.paginationButton}
					disabled={page === totalPages}
					onPress={() => setPage(page + 1)}
				>
					<Text style={styles.paginationButtonText}>Suivant</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	tripContainer: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
	},
	tripText: {
		fontSize: 16,
		marginBottom: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		backgroundColor: "#1E90FF",
		alignItems: "center",
		marginRight: 5,
	},
	leaveButton: {
		backgroundColor: "#FF4500",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
	paginationContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	paginationButton: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "#1E90FF",
	},
	paginationButtonText: {
		color: "#fff",
		fontSize: 16,
	},
});
