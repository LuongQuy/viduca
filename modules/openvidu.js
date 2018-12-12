module.exports = (server) => {
    const io = require('socket.io')(server);
    const OpenVidu = require('openvidu-node-client').OpenVidu;
    const OV = new OpenVidu('localhost:4443', 'MY_SECRET');
    var mapSessions = {};
    var mapSessionNameTokens = {};
    io.on('connection', socket => {
        console.log(socket);
    });
}