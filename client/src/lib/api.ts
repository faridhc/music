import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth
export const registerUser = (data: { username: string; email: string; password: string }) =>
  api.post("/auth/register", data);
export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");

// Songs
export const getSongs = (params?: Record<string, string>) => api.get("/songs", { params });
export const getTrending = () => api.get("/songs/trending");
export const getSong = (id: string) => api.get(`/songs/${id}`);
export const likeSong = (id: string) => api.post(`/songs/${id}/like`);
export const playSong = (id: string) => api.post(`/songs/${id}/play`);

// Playlists
export const getPlaylists = () => api.get("/playlists");
export const getPlaylist = (id: string) => api.get(`/playlists/${id}`);
export const createPlaylist = (data: FormData) => api.post("/playlists", data);

// Search
export const searchAll = (q: string) => api.get("/search", { params: { q } });
export const searchSuggestions = (q: string) => api.get("/search/suggestions", { params: { q } });

// Users
export const getUser = (id: string) => api.get(`/users/${id}`);
export const followUser = (id: string) => api.post(`/users/${id}/follow`);
export const getRecommendations = () => api.get("/users/me/recommendations");

// Admin
export const getAdminStats = () => api.get("/admin/stats");
export const getAdminUsers = () => api.get("/admin/users");

export default api;
