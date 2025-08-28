// src/utils/id.js
export function normalizeId(x) {
  if (!x) return "";
  if (typeof x === "string") return x.trim();

  // Mongoose document with nested _id
  if (x._id) return normalizeId(x._id);

  // Mongo ObjectId instance (node mongodb / mongoose)
  if (typeof x.toHexString === "function") return x.toHexString();

  // Objects that implement a useful toString (e.g., ObjectId)
  if (typeof x === "object" && typeof x.toString === "function") {
    const s = x.toString();
    if (/^[a-f0-9]{24}$/i.test(s)) return s;
  }

  // Some serializers: { $oid: "..." }
  if (x.$oid) return x.$oid;

  // Buffer-like shape: { buffer: { data: [...] } } or { buffer: [...] }
  let buf = x.buffer?.data ?? x.buffer ?? x.data;
  if (buf) {
    // Node Buffer style: { type: 'Buffer', data: [...] }
    if (buf.type === "Buffer" && Array.isArray(buf.data)) {
      buf = buf.data;
    }

    // Typed array support
    if (ArrayBuffer.isView(buf)) {
      buf = Array.from(buf);
    }

    // Plain object with numeric keys: {0: 104, 1: 152, ...}
    if (!Array.isArray(buf) && typeof buf === "object") {
      const values = Object.values(buf);
      if (values.every((v) => typeof v === "number")) {
        buf = values;
      }
    }

    if (Array.isArray(buf)) {
      const hex = buf
        .map((b) => Number(b).toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 24);
      if (hex) return hex;
    }
  }

  // fallback (safe)
  const str = String(x);
  // Avoid leaking "[object Object]" into URLs
  if (str === "[object Object]") return "";
  return str;
}
