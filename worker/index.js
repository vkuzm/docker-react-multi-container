const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPost,
    retry_strategy: () => 1000
});
const redisSubscriber = redisClient.duplicate();

function fib(index) {
    if (index < 2) {
        return index;
    }
    return fib(index - 2) + fib(index - 1); 
}   

redisSubscriber.on('message', (channel, message) => {
    const index = message;
    redisClient.hset('values', index, fib(parseInt(index))); 
});
redisSubscriber.subscribe('insert');
