import Redis from 'ioredis';
const redis = new Redis(6379, 'redis-app');

redis.on('ready', () => console.log('Conected to Redis'));
export default redis;
