"use server";

import { cookies } from "next/headers";

const baseURL = process.env.API_URL;

export async function httpServer<T>(
  path: string,
  init?: RequestInit & {
    auth?: boolean;
  },
): Promise<T> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${baseURL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: cookieHeader,
    },
    cache: init?.auth ? "no-store" : "force-cache",
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}
