/** Client-side fetch helper for admin API calls with JSON + error handling. */
type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T = unknown>(url: string, opts: ApiOptions = {}): Promise<T> {
  const { body, headers, ...rest } = opts;
  const init: RequestInit = { ...rest };

  if (body !== undefined) {
    if (typeof body === "object" && !(body instanceof FormData)) {
      init.headers = { "Content-Type": "application/json", ...(headers as Record<string, string>) };
      init.body = JSON.stringify(body);
    } else {
      init.headers = headers;
      init.body = body as BodyInit;
    }
  } else if (headers) {
    init.headers = headers;
  }

  const res = await fetch(url, init);
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/admin/login";
    throw new Error("Not authenticated");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
  return data as T;
}
