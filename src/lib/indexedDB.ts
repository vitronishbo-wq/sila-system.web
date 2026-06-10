import { FucMilestone, EducationCapability } from '../types';
import { FUC_MILESTONES, EDUCATION_CAPABILITIES } from '../data/silaData';

const DB_NAME = 'SilaOfflineCacheDB';
const DB_VERSION = 1;
const FUC_STORE = 'fuc_milestones';
const CAPABILITIES_STORE = 'education_capabilities';

// Fallback in-memory store in case IndexedDB is blocked in sandboxed iframe environments
class MemoryDBCache {
  private milestones: FucMilestone[] = [...FUC_MILESTONES];
  private capabilities: EducationCapability[] = [...EDUCATION_CAPABILITIES];

  async getFucMilestones(): Promise<FucMilestone[]> {
    return this.milestones;
  }
  async saveFucMilestones(data: FucMilestone[]): Promise<void> {
    this.milestones = data;
  }
  async getEducationCapabilities(): Promise<EducationCapability[]> {
    return this.capabilities;
  }
  async saveEducationCapabilities(data: EducationCapability[]): Promise<void> {
    this.capabilities = data;
  }
}

const memoryFallback = new MemoryDBCache();

// Verify availability of IndexedDB
const isIndexedDBSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch (e) {
    return false;
  }
};

export function initIndexedDB(): Promise<IDBDatabase | null> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB is not supported or is blocked in this environment. Using in-memory fallback cache.');
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(FUC_STORE)) {
          db.createObjectStore(FUC_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(CAPABILITIES_STORE)) {
          db.createObjectStore(CAPABILITIES_STORE, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('Failed to open IndexedDB:', event);
        resolve(null);
      };
    } catch (err) {
      console.error('IndexedDB exception caught:', err);
      resolve(null);
    }
  });
}

export async function seedIndexedDB(): Promise<void> {
  const db = await initIndexedDB();
  if (!db) {
    // Already pre-seeded memory fallback
    return;
  }

  return new Promise<void>((resolve) => {
    try {
      const transaction = db.transaction([FUC_STORE, CAPABILITIES_STORE], 'readwrite');
      const fucStore = transaction.objectStore(FUC_STORE);
      const capStore = transaction.objectStore(CAPABILITIES_STORE);

      // Verify if data already exists to avoid redundant seeding
      const countReq = fucStore.count();
      
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          console.log('[IndexedDB] Seeding FUC Milestones and Education Capabilities to local cache...');
          FUC_MILESTONES.forEach((item) => {
            fucStore.put(item);
          });
          EDUCATION_CAPABILITIES.forEach((item) => {
            capStore.put(item);
          });
        } else {
          console.log('[IndexedDB] Local cache already populated.');
        }
        resolve();
      };

      countReq.onerror = () => {
        // Fallback to putting directly
        FUC_MILESTONES.forEach((item) => fucStore.put(item));
        EDUCATION_CAPABILITIES.forEach((item) => capStore.put(item));
        resolve();
      };
    } catch (err) {
      console.error('Error seeding IndexedDB, using fallback:', err);
      resolve();
    }
  });
}

export async function fetchFucMilestonesCached(): Promise<FucMilestone[]> {
  const db = await initIndexedDB();
  if (!db) {
    return memoryFallback.getFucMilestones();
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(FUC_STORE, 'readonly');
      const store = transaction.objectStore(FUC_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        if (request.result && request.result.length > 0) {
          resolve(request.result);
        } else {
          resolve(FUC_MILESTONES);
        }
      };

      request.onerror = () => {
        resolve(FUC_MILESTONES);
      };
    } catch (e) {
      resolve(FUC_MILESTONES);
    }
  });
}

export async function fetchCapabilitiesCached(): Promise<EducationCapability[]> {
  const db = await initIndexedDB();
  if (!db) {
    return memoryFallback.getEducationCapabilities();
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(CAPABILITIES_STORE, 'readonly');
      const store = transaction.objectStore(CAPABILITIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        if (request.result && request.result.length > 0) {
          resolve(request.result);
        } else {
          resolve(EDUCATION_CAPABILITIES);
        }
      };

      request.onerror = () => {
        resolve(EDUCATION_CAPABILITIES);
      };
    } catch (e) {
      resolve(EDUCATION_CAPABILITIES);
    }
  });
}

// Support updating cached data locally in offline edit flows (if any exist)
export async function updateCachedFucMilestone(milestone: FucMilestone): Promise<void> {
  const db = await initIndexedDB();
  if (!db) {
    const list = await memoryFallback.getFucMilestones();
    const updated = list.map((item) => item.id === milestone.id ? milestone : item);
    await memoryFallback.saveFucMilestones(updated);
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(FUC_STORE, 'readwrite');
      const store = transaction.objectStore(FUC_STORE);
      const req = store.put(milestone);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}
