export const BASE_URL: string = import.meta.env.VITE_API_URL as string;
export const CLIENT_URL: string = import.meta.env.VITE_FRONTEND_URL as string;
export const WS_ENDPOINT: string = import.meta.env.VITE_WS_ENDPOINT as string;

// The API authorize url to which users will be redirected.
export const API42_URL = "https://api.intra.42.fr/oauth/authorize";
// The client ID you received from 42 when you registered.
export const API42_CLIENT_ID = import.meta.env.VITE_API42_CLIENT_ID as string;
// The URL in your app where users will be sent after authorization.
export const API42_REDIRECT = `${BASE_URL}/auth/auth42/callback`;
