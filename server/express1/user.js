const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userRouter = express.Router()
const redisClient = require("./db/redis_con")
const { RateLimiterRedis } = require('rate-limiter-flexible');
const pino = require('pino');
const expressPino = require('express-pino-logger');
// 必须配套使用 pino-pretty，这里虽然没有require，但是必须npm安装，否则报错

// RateLimiterRedis有版本兼容问题，故还是用express-rate-limit
const rateLimit0 = require("express-rate-limit");
const registerlimiter0 = rateLimit0({
  windowMs: 24 * 60 * 60 * 1000, // 1天
  max: 20, // 在1天内，每个IP最大注册请求次数为20
  message: { error: "注册接口一天只允许调用20次" }
});

const db = require("./db/mysql_con")

// 创建速率限制器
const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'register',
  points: 20, // Number of requests
  duration: 24 * 60 * 60, // Per 24 hours
});

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login',
  points: 10, // Number of requests
  duration: 24 * 60 * 60, // Per 24 hours
});

async function rateLimit(req, res, next, limiter) {
  try {
    // const v=await limiter.consume(req.ip); //rate-limiter-flexible库有版本兼容问题
    // console.log(v)
    next();
  } catch (rejRes) {
    res.status(429).send('Too Many Requests');
  }
}

// log异步处理：将日志写入操作放入队列中异步处理，可以减少请求处理时间。
// Node.js 中的大部分 I/O 操作都是非阻塞的，包括文件写入。例如，当你使用 winston 或 console.log 写入日志时，Node.js 会将这些操作放入事件队列中，然后立即返回，以便处理其他任务。
// 如果日志写入操作过于频繁或者数据过大，可能会导致 Node.js 的事件队列积压，影响应用程序性能。这种情况下，你可能需要使用一些更高级的技术来解决问题，如日志流、批量写入、内存队列等。
const logger = pino({
  level: 'error',
  transport: {
    target: 'pino-pretty'
  },
});
const expressLogger = expressPino({ logger });
userRouter.use(expressLogger);

userRouter.post('/register', registerlimiter0, async (req, res) => {
  let { username, password } = req.body;
  // 将密码转换为 bcrypt hash
  let passwordHash = await bcrypt.hash(password, 10); // 10 是 saltRounds，代表生成盐的复杂度，即使相同的pswd,每次得到的值也不一样
  // let ip=req.ip //nginx代理后，req.ip会变成nginx的ip，本地调试，得到的ip是::1,这是IPv6地址格式的localhost（即，本地主机）,所以要用下面的方法获取ip
  const forwarded = req.headers['x-forwarded-for'];
  // 经过nginx反向代理，nginx会加上 X-Forwarded-For,X-Real-IP，这是原始的请求ip，所以通过这个header来获取客户端的真实IP。
  // 但是请注意，由于客户端可以轻松伪造X-Forwarded-For头部，因此应该只信任来自可信赖代理服务器的X-Forwarded-For头部。
  let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  if (ip == "::1") {
    // 本地调试可以注册多个
    ip = "::1" + Math.random().toString(36).substr(2, 5)
  }
  // 插入新用户
  db.query('INSERT INTO user (name, psw, ip) VALUES (?, ? ,? )', [username, passwordHash, ip], (error, results) => {
    if (error) {
      console.log('Error when inserting new user: ', error);//TODO: 防止恶意攻击，这里的日志应该优化
      // 1使用日志等级：对于不同的信息，我们可以设置不同的日志等级，例如 Info, Warning, Error 和 Critical。在大量用户注册的情况下，我们可能只关注那些导致错误的注册请求，因此，我们可以将日志等级设置为 Error 或者更高。
      // 例如 winston、bunyan 或 log4js
      // const winston = require('winston');
      // const logger = winston.createLogger({
      //   level: 'info', // 日志等级，这里设置为 'info'，则只有 'info' 及以上等级的日志会被记录
      //   format: winston.format.json(),
      //   defaultMeta: { service: 'user-service' },
      //   transports: [
      //     new winston.transports.File({ filename: 'error.log', level: 'error' }), // 错误日志写入 error.log
      //     new winston.transports.File({ filename: 'combined.log' }) // 所有日志写入 combined.log
      //   ]
      // });
      // // 如果不是生产环境，也在控制台输出
      // if (process.env.NODE_ENV !== 'production') {
      //   logger.add(new winston.transports.Console({
      //     format: winston.format.simple(),
      //   }));
      // }
      // logger.info('Hello again distributed logs');
      // logger.error('Hello again distributed logs'); //生产环境下，只会写入本行log

      // 2结合监控系统：将错误指标发送到一些监控系统（如 Prometheus, Grafana, Sentry 等）。这样，当错误达到某个阈值时，你就可以收到通知，而不必通过日志文件查找每一个错误。
      // 3日志回滚：你可以设定一个日志文件的最大大小，超过这个大小后，旧的日志会被新的日志替换。这种方法叫做日志回滚。
      // npm install winston winston-daily-rotate-file
      // require('winston-daily-rotate-file');
      // // 创建一个 DailyRotateFile transport
      // var transport = new (winston.transports.DailyRotateFile)({
      //   filename: 'application-%DATE%.log',
      //   datePattern: 'YYYY-MM-DD-HH',
      //   zippedArchive: true,
      //   maxSize: '20m',
      //   maxFiles: '14d'
      // });
      // transport.on('rotate', function(oldFilename, newFilename) {
      //   // 在这里可以做些什么，比如发送邮件通知管理员等
      // });
      // const logger = winston.createLogger({
      //   transports: [
      //     transport
      //   ]
      // });
      // 在这个例子中，winston-daily-rotate-file 插件用于创建一个新的 transport。这个 transport 会每天自动创建一个新的日志文件，并且如果任何日志文件大小超过 20MB，则会创建一个新的日志文件，并将旧的日志文件压缩。同时，它会自动删除超过 14 天的日志文件。




      // 5集中式日志系统：例如 ELK(Elasticsearch, Logstash, Kibana) 堆栈或者 Graylog，他们可以帮助你去集中、搜索以及可视化实时日志数据。
      // 6错误汇总：当发生相同的错误时，而不是每次都打印，你可以选择只打印第一次，并且计数后续发生的次数。
      logger.info("aaa")
      logger.error("bbb") //本地控制台不会显示aaa和bbb，但是server上output.log里会有bbb,因为上面设置了pino级别为error，所以aaa不会显示
      
      return res.status(500).json({ error: "add user fail" });
    }
    return res.json({ msg: 'Registration successful', code: 0 });
  });
});


let errorStore = {}; // 存储错误的对象计数，用于去重，节省log
// 每隔一段时间将错误计数打印并清空
setInterval(() => {
  for (const key in errorStore) {
    const { count, timestamp } = errorStore[key];
    // 如果最后一次错误发生距离现在超过60秒，就打印并清空
    if (Date.now() - timestamp > 10*60*1000) { //10分钟清理一次
      logger.error(`Same error occurred ${count} times in the last minute.ID：${errorStore[key].id}`);
      delete errorStore[key];
    }
  }
}, 60*1000);//1分钟检查1次

userRouter.post('/login', (req, res, next) => rateLimit(req, res, next, loginLimiter), (req, res) => {
  let { username, password } = req.body;
    // 重点：反面例子let username = req.body.username; // 用户输入的数据
    // let sql = "SELECT * FROM user WHERE name = '" + username + "'";
    // db.query(sql, async (error, results) => {.......});
    // 那么此时用户可以输入将username设置为 "'; DROP TABLE user; --"语句会变成： SELECT * FROM user WHERE name = ''; DROP TABLE user; --'。
//     参数化查询的原理在于将 SQL 语句与数据分开处理，把用户输入当作参数，而非直接拼接到 SQL 语句中。因此，这个过程消除了攻击者通过构造恶意输入来改变 SQL 语句结构的可能。
// 创建带有占位符的 SQL 语句：例如，在你的例子中，SQL 语句是 'SELECT * FROM user WHERE name = ?'，这里的 ? 是占位符。
// 发送 SQL 语句和参数给数据库：两者被独立发送，其中参数是一个数组，包含了应该插入到 SQL 语句中各个占位符位置的值。
// 数据库对 SQL 语句进行预编译：在这个阶段，数据库不知道具体的参数值，只知道它们的类型（例如字符串、整数等）。数据库会先编译 SQL 语句，确定执行计划。
// 填充参数并执行 SQL 语句：然后，数据库会用实际的参数替换掉 SQL 语句中的占位符，并执行最终的 SQL 语句。
// 这个过程保证了即使用户输入包含了特殊字符; DROP TABLE user; 也会解析为select * from user where name="; DROP TABLE user; --'"
    db.query('SELECT * FROM user WHERE name = ?', [username], async (error, results) => {
    if (error || results.length === 0) {
      const key = JSON.stringify(error); // 将错误对象转化为字符串作为键
      if (!errorStore[key]) { // 如果错误之前没有发生过
        errorStore[key] = { count: 1, timestamp: Date.now(), id: crypto.randomBytes(16).toString('hex') };
        logger.error("id:", errorStore[key].id);
        logger.error('Error when inserting new user: ', error);
      } else { // 如果错误已经发生过
        errorStore[key].count += 1;
      }
      return res.status(200).json({ msg: 'Invalid username or password', code: 2 });
    }
    const match = await bcrypt.compare(password, results[0].psw);
    if (!match) {
      return res.status(200).json({ msg: 'Invalid username or password', code: 3 });
    }
    let token = await bcrypt.hash(Math.random().toString(36).substr(2), 10)
    redisClient.set(token, username, 'EX', 60 * 60);
    return res.json({ msg: 'Login successful', token, code: 0 });
  });
});

userRouter.get('/currentUser',async (req, res) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  try {
    const username = await redisClient.get(token)
    console.log(username)
    if (username === null) {
      return res.status(200).json({ msg: 'Invalid token', code: 3 });
    }
    console.log("username", username)
    db.query('SELECT id, name FROM user WHERE name = ?', [username], (error, results) => {
      if (error || results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const r = {
        "success": true,
        "data": {
          "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
          "email": "antdesign@alipay.com",
          "title": "交互专家",
          "group": "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
          "tags": [
            { "key": "0", "label": "很有想法的" },
            { "key": "1", "label": "专注设计" }
          ],
          "notifyCount": 12,
          "unreadCount": 11,
          "country": "China",
          "access": "admin",
          "geographic": {
            "province": { "label": "浙江省", },
            "city": { "label": "杭州市", "key": "330100" }
          },
          "address": "西湖区工专路 77 号",
          "phone": "0752-268888888"
        }
      }
      r.data.name = results[0].name
      r.data.userid = results[0].id
      return res.json(r);
    });
  } catch (error) {
    console.log('Error when getting username: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = userRouter