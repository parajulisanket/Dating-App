export type Coords = { lat: number; lng: number };

/** Get device coordinates with a quick cached try, then high-accuracy fallback */
export function getCoords(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("GeolocationNotAvailable"));
      return;
    }

    let settled = false;
    const done = (ok: boolean, v?: any) => {
      if (settled) return;
      settled = true;
      ok ? resolve(v) : reject(v);
    };

    // Quick cached attempt first (fast UX)
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        done(true, { lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // Fallback: high-accuracy with longer timeout
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            done(true, { lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => {
            const map: Record<number, string> = {
              1: "PermissionDenied",
              2: "PositionUnavailable",
              3: "Timeout",
            };
            done(false, new Error(map[err.code] || "GeoError"));
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
    );
  });
}

/** Reverse-geocode to "Place, City, Country" (e.g., "Baneshwor, Kathmandu, Nepal") */
export async function reverseGeocodePretty(
  lat: number,
  lng: number
): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    { headers: { Accept: "application/json" } }
  );
  const data = await res.json();
  const a = data?.address || {};

  const place =
    a.neighbourhood ||
    a.suburb ||
    a.quarter ||
    a.locality ||
    a.hamlet ||
    a.residential ||
    "";

  const city =
    a.city || a.town || a.village || a.municipality || a.county || "";

  const country = a.country || "";

  const toTitleCase = (s: string) =>
    s
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");

  const pretty = [place, city, country]
    .filter(Boolean)
    .map(toTitleCase)
    .join(", ");

  return pretty || `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
