export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const API_42_ID = process.env.API_42_ID;
export const API_42_SECRET = process.env.API_42_SECRET;
export const API_42_URI = process.env.API_42_URI;
export const API_42_NEW_TOKEN = "https://api.intra.42.fr/oauth/token";
export const API_42_USER = "https://api.intra.42.fr/v2/me";

export const AUTH_EXEMPT_ROUTES =
  "/auth/(Oauth42/login|Oauth|auth42/callback|user|signin|signup|signout|google|google/callback)";
