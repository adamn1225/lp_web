import { openDB } from 'idb';

const DB_NAME = 'availabilityCache';
const STORE_NAME = 'cacheStore';
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

interface CacheItem {
    value: any;
    timestamp: number;
}

export const setCache = async (key: string, value: any): Promise<void> => {
    const db = await initDB();
    const timestamp = Date.now();
    await db.put(STORE_NAME, { value, timestamp } as CacheItem, key);
};

export const getCache = async (key: string): Promise<any | null> => {
    const db = await initDB();
    const cached = await db.get(STORE_NAME, key);
    if (cached) {
        const { value, timestamp } = cached;
        if (Date.now() - timestamp < EXPIRATION_TIME) {
            return value;
        } else {
            await db.delete(STORE_NAME, key);
        }
    }
    return null;
};

export const clearCache = async (): Promise<void> => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};