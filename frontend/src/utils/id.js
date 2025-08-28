// src/utils/id.js
export function normalizeId(x) {
  if (!x) return "";
  if (typeof x === "string") return x;

  // Mongoose document with nested _id
  if (x._id) return normalizeId(x._id);

  // Mongo ObjectId instance (node mongodb / mongoose)
  if (typeof x.toHexString === "function") return x.toHexString();

  // Some serializers: { $oid: "..." }
  if (x.$oid) return x.$oid;

  // Buffer-like shape: { buffer: { data: [...] } } or { buffer: [...] }
  const buf = x.buffer?.data ?? x.buffer;
  if (Array.isArray(buf)) {
    return buf.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
  }

  // fallback (safe)
  return String(x);
}
