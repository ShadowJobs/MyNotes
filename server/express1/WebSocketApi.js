const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = require("./db/mysql_con")
const MAX_CONNECTIONS = 20; // 设置你的最大连接数
const MAX_MESSAGE_SIZE = 500;
const MAX_MESSAGES_PER_SECOND = 5; // 每秒最大消息数
let connectionCount = 0;

// 通过中间件的方式，可以共用端口，将/wss-req的请求转到websocket接口,目前是用nginx做的
// app.use('/wss-req', createProxyMiddleware({
//   target: 'http://localhost:5000', 
//   ws: true,
//   router: function(req) {
//     return {
//       target: 'ws://localhost:5000',
//     };
//   },
// }));
// 但是注意要加upgrade处理
// server.on('upgrade', (request, socket, head) => {
//   const pathname = url.parse(request.url).pathname;
//   if (pathname === '/wss-req') {
//     wss.handleUpgrade(request, socket, head, function done(ws) {
//       wss.emit('connection', ws, request);
//     });
//   } else {
//     socket.destroy();
//   }
// });
function startWebsocket() {
  const clients = new Map(); // Map of userName -> WebSocket
  function broadcastUserList() {
    const userList = Array.from(clients.keys());
    if(userList.length>0){
      db.query('SELECT id,name,gender FROM user where name in (?)', [userList], (error, results) => {
        if (error) {
          console.log(error)
          return;
        }
        console.log(results)
        const messageObj = { type: 'user_list', users: results };
        const message = JSON.stringify(messageObj);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
    }
  }
  function handleMessage(messageObj) {
    const timestamp = new Date().toISOString();
    const messageWithTimestamp = JSON.stringify({ ...messageObj, timestamp });
    if (messageObj.to === 'all') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageWithTimestamp); // 发送带有时间戳的消息
        }
      });
    } else if (clients.has(messageObj.to)) {
      const client = clients.get(messageObj.to);
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageWithTimestamp);
      }
    }
  }
  wss.on('connection', (ws) => {
    if (connectionCount >= MAX_CONNECTIONS) {
      ws.send(JSON.stringify({msg:'超出最大连接数。Too many connections.',type:"error"}));
      ws.close();
      return;
    }
    connectionCount++;
    let messageCount = 0;
    let lastResetTime = Date.now();
    let userName = null;
    ws.on('message', (message) => {
      if (message.length > MAX_MESSAGE_SIZE) {
        ws.send(JSON.stringify({msg:'string too long. 消息过长',type:"error"}));
        return;
      }
      const now = Date.now();
      // 如果上次重置距现在已经超过1秒，则重置计数器和时间戳
      if (now - lastResetTime >= 1000) {
          messageCount = 0;
          lastResetTime = now;
      }
      messageCount++;
      if (messageCount > MAX_MESSAGES_PER_SECOND) {
          ws.send(JSON.stringify({msg:'超出每秒最大消息数，断开链接。Too many messages per second.',type:"error"}));
          ws.close();
          return;
      }
      const messageObj = JSON.parse(message);
      if(messageObj.type==='login'){
        userName = messageObj.name;
        clients.set(userName, ws);
        broadcastUserList();
      }else if(messageObj.type==='message'){
        handleMessage(messageObj);
      }
    });

    ws.on('close', () => {
      connectionCount--;
      clients.delete(userName);
      broadcastUserList();
    });
  });

  server.listen(5001, () => {
    console.log('Listening websocket on http://localhost:5001');
  });
}
module.exports = {
  startWebsocket,
  wss
}