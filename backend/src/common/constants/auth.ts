export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// The endpoint to exchange a code for an access token.
export const API_42_NEW_TOKEN = "https://api.intra.42.fr/oauth/token";
// The client ID you received from 42 when you registered.
export const API_42_ID = process.env.API_42_ID;
// The client secret you received from 42 when you registered.
export const API_42_SECRET = process.env.API_42_SECRET;
// The URL in your app where users will be sent after authorization.
export const API_42_REDIRECT = "http://localhost:5173";
// The route of the 42 API to get the user information.
export const API_42_USER = "https://api.intra.42.fr/v2/me";

export const AUTH_EXEMPT_ROUTES =
  "/auth/(Oauth42/login|Oauth|auth42/callback|user|signin|signup|signout|google|google/callback)";
