const store = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;

export function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function set(key, data, ttl = DEFAULT_TTL) {
  store.set(key, { data, expiry: Date.now() + ttl });
}

export function remove(key) {
  store.delete(key);
}

export function size() {
  return store.size;
}

export function clear() {
  store.clear();
}
