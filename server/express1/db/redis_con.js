
const createClient = require('redis').createClient;

const client = createClient({ 
  host: '127.0.1.1', 
  port: 6379, 
  // username: 'difyai123456',
  password: 'difyai123456',
});// 默认连接 127.0.0.1:6379，也可加参数{host: 'localhost',port: 6379}
client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});
client.connect()

module.exports = client;