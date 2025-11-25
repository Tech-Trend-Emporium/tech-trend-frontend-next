import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  syncSessionCookies,
  clearSessionCookies,
} from "@/src/lib/sessionLink";

// Reset module state before each test
beforeEach(() => {
  vi.restoreAllMocks();
  // Reload module to reset lastAccessToken, inflight, syncing
  vi.resetModules();
});

describe("syncSessionCookies", () => {

  it("should return immediately if accessToken is missing", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    await syncSessionCookies({}); // no accessToken

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should POST session payload when token is new", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      accessToken: "ABC123",
      refreshToken: "REFRESH",
      role: "user",
      rememberMe: true,
    };

    await syncSessionCookies(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }
    );
  });

  it("should not call fetch again if token is unchanged and no inflight", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      accessToken: "ABC123456",
      refreshToken: "REFRESH",
      role: "user",
      rememberMe: true,
    };

    await syncSessionCookies(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await syncSessionCookies(payload);

    // still only 1 call
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should wait for inflight request when syncing is true", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const payload = { accessToken: "TOKEN123" };

    // first call → starts inflight
    const p1 = await syncSessionCookies(payload);

    // now simulate a second parallel call
    const p2 = await syncSessionCookies(payload);

    expect(p1).toBe(p2); // Must return same inflight promise

    await p1;

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should update lastAccessToken after successful POST", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const payload = { accessToken: "XYZ789" };

    // First call triggers post
    await syncSessionCookies(payload);
    await syncSessionCookies(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

});

describe("clearSessionCookies", () => {

  it("should DELETE session cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await clearSessionCookies();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/session",
      { method: "DELETE", keepalive: true }
    );
  });

  it("should wait for inflight request before deleting cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const module = await import("@/src/lib/sessionLink");
    const { syncSessionCookies: sync } = module;

    const payload = { accessToken: "WAITME" };

    // Start a sync request but don't await it yet
    const pSync = sync(payload);

    // Now clear cookies → must wait for pSync
    await clearSessionCookies();

    expect(fetchMock).toHaveBeenCalledTimes(2); 
    // 1 POST, 1 DELETE
  });

});
