const DB_NAME = "asl_store";
const DB_VERSION = 1;
const STORE_NAME = "kv";

let dbPromise = null;

function openDB() {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("NO_INDEXEDDB"));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("INDEXEDDB_OPEN_FAILED"));
      req.onblocked = () => reject(new Error("INDEXEDDB_BLOCKED"));
    });
    dbPromise.catch(() => { dbPromise = null; });
  }
  return dbPromise;
}

export async function idbGet(key) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function idbSet(key, value) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}

export async function idbRemove(key) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}

export function hasLocal(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  idbSet(key, { v: value, t: Date.now() });
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
  idbRemove(key);
}

export async function hydrate(keys) {
  const out = {};
  await Promise.all(
    keys.map(async (key) => {
      if (hasLocal(key)) return;
      const rec = await idbGet(key);
      if (!rec || !Object.prototype.hasOwnProperty.call(rec, "v")) return;
      out[key] = rec.v;
      try {
        localStorage.setItem(key, JSON.stringify(rec.v));
      } catch {}
    }),
  );
  return out;
}
