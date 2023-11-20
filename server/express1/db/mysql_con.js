
const mysql = require('mysql2');

// const db = mysql.createConnection({
const db = mysql.createPool({ //createConnection时间久了会自动断开连接，所以用pool
  host: 'localhost',
  user: 'root',
  password: 'mmtly',
  database: 'antdp1use'
});
db.on('connection', (stream) => {
  console.log('mysql connected!');
});
db.on('error', (err) => {
  console.log('mysql error', err);
});
module.exports = db;