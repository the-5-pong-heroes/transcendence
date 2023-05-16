import type { UserAuth } from "@types";
import { USER_STORAGE_KEY } from "@/constants";

export function saveUser(user: UserAuth): void {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("storage"));
}

export function getUser(): UserAuth | undefined {
  const user = sessionStorage.getItem(USER_STORAGE_KEY);

  return user ? (JSON.parse(user) as UserAuth) : undefined;
}

export function removeUser(): void {
  sessionStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event("storage"));
}
