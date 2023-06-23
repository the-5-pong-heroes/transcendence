// The endpoint to exchange a code for an access token.
export const API_42_NEW_TOKEN = "https://api.intra.42.fr/oauth/token";
// The URL in your app where users will be sent after authorization.
export const API_42_REDIRECT_SUCCESS = "http://localhost:3333/auth/auth42/callback";
// The route of the 42 API to get the user information.
export const API_42_USER_INFO = "https://api.intra.42.fr/v2/me";

export const AUTH_EXEMPT_ROUTES = "/auth/(auth42/callback|user|signout|2FA/status)";
