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
  const response: Response = await fetch(request);

  return (await response.json()) as T;
}

export async function customFetch<T>(
  method: string,
  path: string,
  body: object | undefined,
  config?: RequestInit
): Promise<T> {
  if (config?.method in ["POST", "PUT"]) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  // checks that the HTTP method is valid
  method = method.toUpperCase();
  if (!method) {
    method = "GET";
  }
  const valid_methods = ["POST", "GET", "PUT", "PATCH", "DELETE"];
  if (!valid_methods.includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }

  const init = {
    method: method,
    body: JSON.stringify(body),
    credentials: "include",
    mode: "cors",
    ...config,
  };

  const request: Request = new Request(`${BASE_URL}${path}`, config);
  const response: Response = await fetch(request);

  return (await response.json()) as T;
}
