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

export async function customFetch<T>(method: string, path: string, body?: object, config?: RequestInit): Promise<T> {
  const init = { method: method.toUpperCase(), body: JSON.stringify(body), ...config };

  return await sendRequest<T>(path, init);
}
