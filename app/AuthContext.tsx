// context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = await AsyncStorage.getItem("userToken");
			if (token) {
				setIsAuthenticated(true);
			}
		};
		checkAuth();
	}, []);

	const login = async (token: string) => {
		await AsyncStorage.setItem("userToken", token);
		setIsAuthenticated(true);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("userToken");
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
