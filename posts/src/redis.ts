import * as redis from 'redis';
import { promisify } from 'util';

export const client = redis.createClient({ url: 'redis://posts-cache:63791' });
export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);

export default { client, getAsync, setAsync };
