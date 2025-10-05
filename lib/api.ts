const BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function post(path: string, body: unknown) {
  if (!BASE) {
    //  Mock mode: just simulate a response
    console.log("MOCK POST", path, body);
    await new Promise((r) => setTimeout(r, 400)); // simulate latency
    return { ok: true }; // fake payload
  }

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
