import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
	user: null,
	token: null,
	login: () => {},
	logout: () => {},
	isAuthenticated: false,
	loading: true,
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() =>
		localStorage.getItem("evenza_token"),
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const storedUser = localStorage.getItem("evenza_user");
			if (storedUser && token) {
				setUser(JSON.parse(storedUser));
			}
		} catch (e) {
			console.error("Failed to parse stored auth user:", e);
			localStorage.removeItem("evenza_user");
			localStorage.removeItem("evenza_token");
		} finally {
			setLoading(false);
		}
	}, [token]);

	const login = (userData, authToken) => {
		setUser(userData);
		setToken(authToken);
		localStorage.setItem("evenza_token", authToken);
		localStorage.setItem("evenza_user", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("evenza_token");
		localStorage.removeItem("evenza_user");
	};

	const isAuthenticated = !!user && !!token;

	return (
		<AuthContext.Provider
			value={{ user, token, login, logout, isAuthenticated, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}

export default AuthContext;
