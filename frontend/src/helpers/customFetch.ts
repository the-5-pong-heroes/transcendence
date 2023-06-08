import { ResponseError } from "./error";

import { BASE_URL } from "@/constants";

interface ErrorMessage {
  message: string;
}

async function sendRequest<T>(path: string, config: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  config.credentials = "include";
  config.mode = "cors";

  if (config.method === "POST" || config.method === "PUT") {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json; charset=utf-8",
    };
  }
  const request = new Request(url, config);
  const response = await fetch(request);

  if (!response.ok) {
    try {
      const { message } = (await response.json()) as ErrorMessage;
      throw new ResponseError(message, response);
    } catch (e) {
      throw new ResponseError("Fetch request failed", response);
    }
  }

  // may error if there is no body, return empty array
  return response.json().catch(() => ({})) as T;
}

export async function customFetch<T, U = undefined>(
  method: string,
  path: string,
  body?: U,
  config?: RequestInit
): Promise<T> {
  const init = { method: method.toUpperCase(), body: JSON.stringify(body), ...config };

  return await sendRequest<T>(path, init);
}

// export async function get<T>(path: string, config?: RequestInit): Promise<T> {
//   const init = { method: "get", ...config };

//   return await sendRequest<T>(path, init);
// }

// export async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
//   const init = { method: "post", body: JSON.stringify(body), ...config };

//   return await sendRequest<U>(path, init);
// }

// export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
//   const init = { method: "put", body: JSON.stringify(body), ...config };

//   return await sendRequest<U>(path, init);
// }

// export async function remove<T>(path: string, config?: RequestInit): Promise<T> {
//   const init = { method: "delete", ...config };

//   return await sendRequest<T>(path, init);
// }

// export async function customFetch<T>(method: string, path: string, body?: T, config?: RequestInit): Promise<T> {
//   const init = { method: method, body: JSON.stringify(body), ...config };

//   return await sendRequest<T>(path, init);
// }
