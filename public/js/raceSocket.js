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
let socket;


$('document').ready(() => {
    socket = io.connect('https://typearena.herokuapp.com/race');

    //Initialize text
    data = $('.raceData').text();
    lst = data.trim().split(' ');
    text_len = data.trim().length;
    limit = lst.length - 1;

    lst.forEach((item, index) => {
        if (index != lst.length - 1)
            lst[index] = item + ' ';
    });
    initializeText(data);

    //get me
    myID = $('.userID').val();
    myName = $('.userName').val();


    addedUsers.push(new Racer(3, { name: myName, 'id': myID }));

    socket.emit('shoutUsersInRoom');

    socket.on('roomInOut', function (newRacer) {
        Racer.initializeNewUsers(newRacer);
    });

    socket.on('startRace', time => {
        // console.log('race bhaga', time);
        raceTimer(5);
        socket.on('wpm', data => {
            let thisUser = addedUsers.filter(a => a.id == data.id)[0];
            thisUser.updateWPM(data.wpm);
            thisUser.animateProgress(data.progress);
        });

        let first = true;
        socket.on('raceEnd', data => {
            let thisUser = addedUsers.filter(a => a.id == data.id)[0];
            thisUser.updateAccuracy(data.accuracy);
            if (first) {
                first = false;
                if (data.id == myID) {
                    confettiAnimator();
                }
            }
        });
    });


    $(window).bind('beforeunload', function () {
        if (socket.connected) {
            socket.disconnect();
        }
    });

    socket.on('connect', () => {
        console.log('SOCKET CONNECTED');
    });

    socket.on('disconnect', time => {
        alert('You have been disconnected!');
        window.location = 'https://typearena.herokuapp.com/';
    });

    socket.on('error', error => {
        console.log(error);
    });

});

raceTimer = time => {

    setTimeout(() => {
        $('#timer').text(time);
        if (time >= 1) {
            raceTimer(time - 1);
        } else if (time == 0) {
            if (!started) {
                started = true;
                start();
                timer();
                $('#timer').text('');
            }
        }
    }, 1000);

}

confettiAnimator = () => {
    // var confettiElement = document.getElementById('my-canvas');
    let confettiSettings = {
        target: document.getElementsByClassName('confetti')[0],
        rotate: true,
        clock: 50
    };
    let confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    setTimeout(() => {
        confetti.clear();
    }, 2000);
}