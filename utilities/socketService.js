let io;

module.exports = {
  init: (httpServer, cb) => {
    io = require('socket.io')(httpServer);
    cb();
  },
  IO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};