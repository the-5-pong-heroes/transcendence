import { BASE_URL } from "@/constants";

/**
 * A Fetch Wrapper to simplify HTTP Requests.
 *
 * See also https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
 *
 * @param method - The HTTP method to use
 * @param path - The path to the resource, for instance `/leaderboard`
 * @param body - The body of the request, for instance `{ username: "John Doe" }`
 * @param config - The RequestInit object to consider in the request
 * @returns the fetch Response (and not the body text of the response parsed as as JSON)
 */
export async function customFetch(
  method: string,
  path: string,
  body: object | null = null,
  config: RequestInit = { headers: {} }
): Promise<Response> {
  method = method.toUpperCase() || "GET"; // GET request by default
  // checks that the HTTP method is valid
  const valid_methods = ["POST", "GET", "PUT", "PATCH", "DELETE"];
  if (!valid_methods.includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }
  // updates the RequestInit headers when necessary
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const ct = { "Content-Type": "application/json; charset=utf-8" };
    config.headers = { ...ct, ...config.headers };
  }
  // builds the options (custom settings) to apply to the request
  const options: RequestInit = {
    method: method,
    cache: "no-cache", // default, no-store, reload, no-cache, force-cache, only-if-cached
    body: body ? JSON.stringify(body) : null,
    credentials: "include", // omit, same-origin, include
    mode: "cors", // cors, no-cors, same-origin, navigate, websocket
    redirect: "follow", // follow, error, manual
    ...config,
  };
  const request: Request = new Request(`${BASE_URL}/${path}`, options);
  const response: Response = await fetch(request);

  return response;
}
