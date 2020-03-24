const randomString = require('randomstring');
const loadPara = require('../utilities/loadParagraph');
const User = require('../models/user');
let io;
let hotel = [];

// Rooms functions
roomPeopleCurrentCount = (roomName) => {
    if (!io.of('/race').clients().adapter.rooms[roomName]) {
        return 0;
    }
    return io.of('/race').clients().adapter.rooms[roomName].length;
};

roomReceptionist = cb => {
    let allotedRoom;
    if (hotel.length > 0) {
        let potentialRooms = hotel.filter(room => room.connectedUsersCount() < 2 && room.raceStarted === false);
        if (potentialRooms.length > 0) {
            allotedRoom = potentialRooms[getRndInteger(0, potentialRooms.length - 1)];
        }
    }

    if (!allotedRoom) {
        roomCreator(roomName => {
            cb(roomName);
        });
    } else {
        cb(allotedRoom.name);
    }

}

roomCreator = cb => {
    let newRoom = randomString.generate(7);
    if (!hotel.filter(room => room.name === newRoom).length) {
        loadPara()
            .then(text => {
                hotel.push({
                    name: newRoom,
                    connectedUsers: function () {
                        // if(io.of('/race').adapter.rooms[this.name]){
                        if (!io.of('/race').adapter.rooms[this.name]) {
                            return [];
                        }
                        return Object.keys(io.of('/race').adapter.rooms[this.name].sockets);
                        // }
                    },
                    connectedUsersCount: function () {
                        return this.connectedUsers().length;
                    },
                    RoomText: text[0],
                    usersFinished: 0,
                    raceStarted: false,
                    raceEnded: false
                });
                cb(newRoom);
            })
            .catch(err => console.log(err));
    } else {
        roomCreator(cb);
    }
}

deleteRoom = roomName => {
    hotel = hotel.filter(room => room.name !== roomName);
}

destroyEmptyRoom = roomName => {
    if (roomPeopleCurrentCount(roomName) == 0) {
        deleteRoom(roomName);
    }
}


//Waiting for 5 users to add
check45users = roomName => {
    let myRoom = hotel.filter(room => room.name === roomName)[0];
    if (typeof (myRoom) !== 'undefined') {
        if (myRoom.connectedUsersCount() == 2) {
            io.of('/race').in(myRoom.name).emit('startRace', 10); //send timer quantity here
            hotel.forEach((room, i) => {
                if (room.name == myRoom.name) {
                    hotel[i].raceStarted = true;
                }
            });
        }
    }
}


//Destroy user and room pair
// destoryUsersRoom = userID =>{
//     delete usersRoom[userID];
// }

//Sending list of users to all when a user joins
allUserInRoomData = roomName => {
    let myRoom = hotel.filter(room => room.name == roomName)[0];
    if (typeof (myRoom) !== 'undefined') {
        let roomUsers = myRoom.connectedUsers();
        let data = [];
        roomUsers.forEach(id => {
            let socket = io.of('/race').connected[id];
            data.push({
                id: socket.handshake.session.user._id,
                name: socket.handshake.session.user.name
            });
        });
        return data;
    } else {
        return null;
    }
}

userInRoom = (userId, roomName) => {

    //If checks if the room exists, if no then we say we didn't found the user in the room
    if (!io.of('/race').adapter.rooms[roomName]) {
        return false;
    }

    let roomMembers = Object.keys(io.of('/race').adapter.rooms[roomName].sockets);
    let bool;

    roomMembers.forEach(usr => {
        let socket = io.of('/race').connected[usr];
        if (String(socket.handshake.session.user._id) == String(userId)) {
            bool = true;
        }
    });
    if (!bool) {
        bool = false;
    }

    return bool;
}


//Random number generator
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.startService = () => {
    io = require('../utilities/socketService').IO();

    io.of('/race').on('connection', socket => {
        let myRoom;
        let userID;
        let winner;

        // socket.handshake.session['hello'] = 'yourDaddy';
        // socket.handshake.session.save();
        // console.log(socket.handshake.session);

        if (!socket.handshake.session.roomName) {
            return;
        }

        if (!userInRoom(socket.handshake.session.user._id, socket.handshake.session.roomName)) {
            userID = socket.handshake.session.user._id;
            myRoom = socket.handshake.session.roomName;

            if (hotel.filter(room => room.name == myRoom)[0]) {
                if (!hotel.filter(room => room.name == myRoom)[0].raceStarted) {
                    socket.join(myRoom);

                    socket.on('wpm', data => {
                        if (hotel.filter(room => room.name == myRoom)[0].raceStarted && !hotel.filter(room => room.name == myRoom)[0].raceEnded) {
                            io.of('/race').in(myRoom).emit('wpm', data);
                        }
                        // else if (hotel.filter(room => room.name == myRoom)[0].raceStarted && hotel.filter(room => room.name == myRoom)[0].raceEnded) {
                        //     socket.off('wpm');
                        //     // socket.leave(myRoom);
                        // }
                    });

                    socket.on('raceEnd', data => {
                        if (!hotel.filter(room => room.name == myRoom)[0].winner) {
                            hotel.filter(room => room.name == myRoom)[0].winner = userID;
                            winner = true;
                        } else {
                            winner = false;
                        }

                        io.of('/race').in(myRoom).emit('raceEnd', data);
                        // socket.leave(myRoom);    
                        if (socket.handshake.session.isLoggedIn) {
                            console.log(userID);
                            User
                                .findById(userID)
                                .then(user => {
                                    let updatedUser = user.updateRace(data.wpm, data.accuracy, hotel.filter(room => room.name == myRoom)[0].RoomText._id, winner);
                                    socket.handshake.session.user = updatedUser;
                                    socket.handshake.session.save();

                                })
                                .catch(err => console.log(err));
                        }
                        // if(hotel.filter(room => room.name == myRoom)[0].connectedUsersCount() == 0){
                        //     socket.disconnect();
                        // }
                    });

                    socket.on('shoutUsersInRoom', () => {
                        io.of('/race').in(myRoom).emit('roomInOut', allUserInRoomData(myRoom));
                    });


                    check45users(myRoom);
                    setTimeout(() => {
                        socket.disconnect();
                    }, 1000 * 60 * 2);
                } else {
                    socket.disconnect();
                    return;
                }

            } else {
                socket.disconnect();
                return;
            }

        } else {
            socket.disconnect();
            return;
        };

        socket.on('disconnect', () => {
            if (myRoom) {
                destroyEmptyRoom(myRoom);
                io.of('/race').in(myRoom).emit('roomInOut', allUserInRoomData(myRoom));
            }
        });
    });
}


exports.selectRoom = (req, res, next) => {
    if (!req.session.roomName) {
        roomReceptionist(room => {
            let text = hotel.filter(a => a.name == room)[0].RoomText;
            req.session['paraData'] = text;
            req.session['roomName'] = room;
            next();
        });
    } else if (!userInRoom(req.session.user._id, req.session.roomName)) {
        roomReceptionist(room => {
            let text = hotel.filter(a => a.name == room)[0].RoomText;
            req.session['paraData'] = text;
            req.session['roomName'] = room;
            next();
        });
    } else {
        res.render('error', {
            logged: req.session.isLoggedIn,
            name: req.session.user.name,
            avgWPM: req.session.user.avgWPM10,
            msg: "You are aleardy in a race."
        });
    }

    //if no no room has been attached, call receptionist
    //if there is a room attached but the room no longer contains the user, call receptionist
}

exports.disconnectThroughLogout = (req, res, next) => {
    let userID = req.session.user._id;

    if (!req.session.roomName) {
        next();
        return;
    }
    let roomName = req.session.roomName;

    if (!io.of('/race').adapter.rooms[roomName]) {
        next();
        return;
    }

    let roomMembers = Object.keys(io.of('/race').adapter.rooms[roomName].sockets);

    roomMembers.forEach(usr => {
        let socket = io.of('/race').connected[usr];
        if (String(socket.handshake.session.user._id) == String(userID)) {
            socket.disconnect();
        }
    });

    next();
}