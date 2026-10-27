const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST || 'redis-16301.c305.ap-south-1-1.ec2.cloud.redislabs.com',
        port: process.env.REDIS_PORT || 16301
    }
});


module.exports=redisClient;



