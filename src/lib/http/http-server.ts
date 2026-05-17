const baseURL = process.env.API_URL;

export async function httpServer<T>(
  path: string,
  init?: RequestInit & {
    next?: NextFetchRequestConfig;
  },
): Promise<T> {
  const res = await fetch(`${baseURL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}
