
const mysql = require('mysql2');

const db = mysql.createConnection({
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