const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15175.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15175
    }
});


module.exports=redisClient;



// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'DWtZaywbifUZEfpPiZ6qLVs4cJALoArH',
//     socket: {
//         host: 'redis-18487.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 18487
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

