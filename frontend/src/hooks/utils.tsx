export function useClient() {
  return async (
    url: string,
    options: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      headers?: { authToken?: string; contentType?: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body?: any;
    },
  ) => {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        ...(options.headers?.contentType
          ? { "Content-Type": options.headers?.contentType }
          : {}),
        Authorization: `Bearer ${options.headers?.authToken}`,
      },
      body: options.body,
    });

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    return await response.json();
  };
}
