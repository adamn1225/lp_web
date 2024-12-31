import { createClient } from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

export { redisClient, connectRedis, getAsync, setAsync };