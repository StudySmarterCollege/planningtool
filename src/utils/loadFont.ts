import fontUrl from "../fonts/DejaVuSans.ttf";

let cached: string | null = null;

export async function loadDejaVuSansBase64(): Promise<string> {
  if (cached) return cached;
  const resp = await fetch(fontUrl);
  const buf = await resp.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  cached = btoa(binary);
  return cached;
}
