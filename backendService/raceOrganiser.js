const io = require('../utilities/socketService').IO();
let room = 1;

roomCurrentCount = () => new Promise(roomName => {
    io.of('/race').in(roomName).clients(function(error,clients){
        if (error) console.log(error);
        return clients.length; 
    });
});


module.exports = ()=>{
    // setInterval(()=>{
    //     io.of('/race').in(room).emit('welcome', 'Welcome to the race room');
    // }, 200);
    io.of('/race').on('connection', socket =>{

        // if(roomCurrentCount(room) >= 2){
        //     room++;
        // }
        roomCurrentCount(room)
            .then( len => {
                if(len >= 2){
                    room++;
                }
                socket.join(room, ()=>{
                    roomCurrentCount(room, len=>{
                        console.log(room + " | " + len);
                    }); 
                });
            })
            .catch(err => {
                console.log(err);
            });
        // console.log(room + ' | '+ roomCurrentCount(room));
    });
} 