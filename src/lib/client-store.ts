type Store<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T) => void;
  update: (fn: (current: T) => T) => void;
};

// Browser-storage-backed store read through useSyncExternalStore, so the server
// and the hydrating client both start from `fallback` and only then swap in the
// stored value.
export function createClientStore<T>(
  storage: () => Storage,
  key: string,
  fallback: T,
  parse: (raw: unknown) => T | null,
): Store<T> {
  let cache = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = (): T => {
    if (loaded) return cache;
    loaded = true;
    try {
      const raw = storage().getItem(key);
      const parsed = raw === null ? null : parse(JSON.parse(raw));
      if (parsed !== null) cache = parsed;
    } catch {
      // unreadable or blocked storage: keep the fallback
    }
    return cache;
  };

  const store: Store<T> = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: load,
    getServerSnapshot: () => fallback,
    set(next) {
      cache = next;
      loaded = true;
      try {
        storage().setItem(key, JSON.stringify(next));
      } catch {
        // storage full or blocked: keep the in-memory value
      }
      listeners.forEach((l) => l());
    },
    update(fn) {
      store.set(fn(load()));
    },
  };

  return store;
}
