// src/utils/id.js
export function normalizeId(x) {
  if (!x) return "";
  if (typeof x === "string") return x;

  // common Mongo shapes
  if (x._id) return normalizeId(x._id);          // doc or populated object
  if (x.toHexString) return x.toHexString();     // ObjectId instance
  if (x.$oid) return x.$oid;                     // some serializers
  if (typeof x.id === "string") return x.id;     // already string id

  // rare: {_bsontype:'ObjectID', id: Buffer } or {buffer:{data:[...]} }
  if (x.buffer?.data && Array.isArray(x.buffer.data)) {
    return x.buffer.data.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
  }

  return String(x);
}
