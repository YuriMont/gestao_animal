import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Adjust based on server config

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("auth_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
