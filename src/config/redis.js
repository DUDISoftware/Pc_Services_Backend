import { env } from '~/config/environment.js'
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://' + env.REDIS_USERNAME + ':' + env.REDIS_PASSWORD + '@' + env.REDIS_URL
});

export const CONNECT_REDIS = async () => {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

export { redisClient }