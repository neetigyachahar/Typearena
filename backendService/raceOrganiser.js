const io = require('../utilities/socketService').IO();
const randomString = require('randomstring');
let hotel = [];

// Rooms functions
roomPeopleCurrentCount = (roomName) => {
    if(!io.of('/race').clients().adapter.rooms[roomName]){
        return 0;
    }
    return io.of('/race').clients().adapter.rooms[roomName].length;
};

roomReceptionist = cb =>{
    let allotedRoom;
    if(hotel.length > 0){
        let potentialRooms = hotel.filter(room => room.connectedUsersCount() < 5);
        allotedRoom = potentialRooms[getRndInteger(0, potentialRooms.length - 1)];
    }

    if(!allotedRoom){
        roomCreator(roomName =>{
            cb(roomName);
        });
    }else{
        cb(allotedRoom.name);
    }

}

roomCreator = cb =>{
    let newRoom = randomString.generate(7);
    if(!hotel.filter(room => room.name === newRoom).length){
        hotel.push({
            name: newRoom,
            connectedUsers: function(){
                if(!io.of('/race').adapter.rooms[this.name].sockets){
                    return [];
                }
                return Object.keys(io.of('/race').adapter.rooms[this.name].sockets);
            },
            connectedUsersCount: function(){
                return this.connectedUsers().length;
            },
            usersFinished: 0,
            raceStarted: false,
            raceEnded: false
        });
        cb(newRoom);
    }else{
        roomCreator(cb);
    }
}

deleteRoom = roomName =>{
    hotel = hotel.filter(room => room.name !== roomName);
}

destroyEmptyRoom = roomName =>{
    if(roomPeopleCurrentCount(roomName) == 0){
        deleteRoom(roomName);
    }
}


//Waiting for 5 users to add
check45users = roomName =>{
    let myRoom = hotel.filter(room => room.name === roomName)[0];
    if(myRoom.connectedUsersCount() == 5){
        io.of('/race').in(myRoom.name).emit('startRace'); //send timer quantity here
        hotel.forEach((room, i) =>{
            if(room.name == myRoom.name){
                hotel[i].raceStarted = true;
            }
        });
    }
}

//Sending list of users to all when a user joins
allUserInRoomData = roomName =>{
    let myRoom = hotel.filter(room => room.name == roomName)[0];
    let roomUsers = myRoom.connectedUsers();
    let data = [];
    roomUsers.forEach(id =>{
        let socket = io.of('/race').connected[id];
        data.push({
            id: socket.handshake.session.user._id,
            name: socket.handshake.session.user.name
        });
    });
    return data;
}


//Random number generator
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = ()=>{
    io.of('/race').on('connection', socket =>{
        let socketRoomName;
        // socket.join('asdf');
        // io.of('/race').in('asdf').emit('startRace');
        if(!socket.handshake.session.user){
            let user = {
                _id: randomString.generate(10),
                name: 'Guest'
            }
            socket.handshake.session['user'] = user;
        }

        roomReceptionist(room =>{
            socket.join(room);
            socketRoomName = room;
            check45users(room);
            io.of('/race').in(room).emit('welcome', allUserInRoomData(room));
            // console.log(hotel[0].connectedUsers());
        });
        // console.log(socket.handshake.session);

        socket.on('disconnect', () =>{
            destroyEmptyRoom(socketRoomName);
            console.log(hotel[0].connectedUsers());
        });
    });
} 