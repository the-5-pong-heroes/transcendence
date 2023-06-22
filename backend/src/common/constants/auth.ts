// The endpoint to exchange a code for an access token.
export const API_42_NEW_TOKEN = "https://api.intra.42.fr/oauth/token";
// The URL in your app where users will be sent after authorization.
export const API_42_REDIRECT = "http://localhost:5173";
// The route of the 42 API to get the user information.
export const API_42_USER = "https://api.intra.42.fr/v2/me";

export const COOKIES_SECRET = process.env.COOKIES_SECRET;

export const AUTH_EXEMPT_ROUTES =
  "/auth/(auth42/callback|user|2FA/status|signout|signin|signup|google|google/callback)";
