let cd = 0;
let cc = 0;
let tmr = 0;
let wrd = 0;
let wpm;
let word_ptr = 1;
let lst_ptr = 0;
let err = 0;
let charTyped;
let started = false;
let ended = false;
let err_ack = false;
let accuracy = 0;
let data;
let lst;
let text_len;
let limit;
let r3;
let addedUsers = [];

let myID;
let userID;


$('document').ready(()=>{
    const socket = io.connect('https://typearena.herokuapp.com/race');

    //Initialize text
    data = $('.raceData').text();
    lst = data.trim().split(' ');
    text_len = data.trim().length;
    limit = lst.length - 1;
    
    lst.forEach((item, index) =>{
        if(index != lst.length -1)
              lst[index] = item+' ';
    });
    initializeText(data);

    //get me
    myID = $('.userID').val();
    myName = $('.userName').val();
    
    
    r3 = new Racer(3, {name: myName, 'id': myID});
    
    start();
    
    socket.emit('shoutUsersInRoom');

    socket.on('roomInOut', function(newRacer){
        console.log(newRacer);
        Racer.initializeNewUsers(newRacer);
    });

    // socket.on('startRace', ()=>{
    //     console.log('race bhaga');
    // });

    // socket.on('wpm', data =>{
    //     // r1.animateProgress(cd);
    //     // r2.animateProgress(cd);
    //     // r4.animateProgress(cd);
    //     // r5.animateProgress(cd);
    // });
    $(window).bind('beforeunload',function(){
        if(socket.connected){
            socket.disconnect();
        }
    });
    
    socket.on('connect', ()=>{
        console.log('SOCKET CONNECTED');
    });

    socket.on('disconnect', ()=>{
        console.log('Arre nikal diya yaar');
        window.location = 'https://typearena.herokuapp.com/';
    });
    
    socket.on('error', error=>{
        console.log(error);
    });

});

