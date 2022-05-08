import * as redis from 'redis';

export default redis.createClient({ url: 'redis://posts-cache:6379' });
