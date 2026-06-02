interface CacheEntry {
  data: any;
  expiry: number;
}

const store = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000;

export function get(key: string): any {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function set(key: string, data: any, ttl = DEFAULT_TTL): void {
  store.set(key, { data, expiry: Date.now() + ttl });
}

export function remove(key: string): void {
  store.delete(key);
}

export function size(): number {
  return store.size;
}

export function clear(): void {
  store.clear();
}
