/**
 * IndexedDB Offline Cache for Kiosk Mode
 * 
 * Replaces localStorage with IndexedDB for high-capacity, reliable
 * offline punch storage on factory floor kiosk devices.
 * 
 * Database: kiosk_offline_db
 * Store: punches
 */

const DB_NAME = 'kiosk_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'punches';

export interface OfflinePunch {
  id?: number;
  employee_id: number;
  employee_name: string;
  timestamp: string;
  log_type: 'Check_In' | 'Check_Out';
  confidence: number;
  gps_lat?: number;
  gps_lng?: number;
  synced: number; // 0 = unsynced, 1 = synced (IndexedDB indexes require IDBValidKey)
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('employee_id', 'employee_id', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a punch record to IndexedDB for offline storage.
 */
export async function savePunch(punch: Omit<OfflinePunch, 'id'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(punch);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieve all unsynced punches from IndexedDB.
 */
export async function getUnsyncedPunches(): Promise<OfflinePunch[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.getAll(0); // 0 = unsynced

    request.onsuccess = () => resolve(request.result as OfflinePunch[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieve all punches from IndexedDB.
 */
export async function getAllPunches(): Promise<OfflinePunch[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as OfflinePunch[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Mark a punch as synced after successful server upload.
 */
export async function markPunchSynced(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.synced = 1;
        store.put(record);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Clear all synced punches from the store to reclaim space.
 */
export async function clearSyncedPunches(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.openCursor(1); // 1 = synced

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get the count of unsynced punches stored offline.
 */
export async function getUnsyncedCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.count(0); // 0 = unsynced

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}
