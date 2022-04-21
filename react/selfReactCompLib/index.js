if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports = require('./dist/linyreact.js');
} else {
  module.exports = require('./dist/linyreact.min.js');
}
