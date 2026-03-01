const DEVICE_ID_KEY = "skillsync_device_id";

function generateDeviceId(): string {
  return `device-${crypto.randomUUID()}`;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    return "server-device";
  }

  const existing = window.localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const created = generateDeviceId();
  window.localStorage.setItem(DEVICE_ID_KEY, created);
  return created;
}
