import { openDB } from 'idb';

const DB_NAME = 'availabilityCache';
const STORE_NAME = 'cacheStore';

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

export const setCache = async (key, value) => {
    const db = await initDB();
    await db.put(STORE_NAME, value, key);
};

export const getCache = async (key) => {
    const db = await initDB();
    return await db.get(STORE_NAME, key);
};

export const clearCache = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};