import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, apiRequest } from "@/lib/api/client";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubEnv("API_URL", "https://api.example.com/");
  vi.stubEnv("API_KEY", "secret");
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("apiRequest", () => {
  it("sends JSON with the API key and no-store caching", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await apiRequest("/contact", {
      method: "POST",
      body: { hello: "world" },
      cache: "no-store",
    });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api.example.com/contact");
    expect(init?.cache).toBe("no-store");
    expect(init?.body).toBe('{"hello":"world"}');
    expect(init?.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-api-key": "secret",
    });
  });

  it("validates the response with the given schema", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 42 }));

    await expect(
      apiRequest("/things/1", {
        schema: z.object({ id: z.string() }),
        next: { revalidate: 60, tags: ["things"] },
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("retries a GET once on a 5xx response", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ id: "1" }));

    const data = await apiRequest("/things/1", {
      schema: z.object({ id: z.string() }),
      next: { revalidate: 60, tags: ["things"] },
    });

    expect(data).toEqual({ id: "1" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reads the reason and item ids from an error response", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { detail: { code: "unknown_items", items: ["lobster"] } },
        { status: 422 },
      ),
    );

    await expect(
      apiRequest("/orders", { method: "POST", body: {}, cache: "no-store" }),
    ).rejects.toMatchObject({
      status: 422,
      code: "unknown_items",
      items: ["lobster"],
    });
  });

  it("never retries a POST", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const request = apiRequest("/contact", {
      method: "POST",
      body: {},
      cache: "no-store",
    });

    await expect(request).rejects.toMatchObject({ status: 500 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
