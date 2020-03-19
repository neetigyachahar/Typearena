let socket = io.connect('http://localhost:5000/race');
$('document').ready(()=>{
    let myID = $('.userID').val();

    socket.on('welcome', function(newRacer){
        console.log(newRacer);
        newRacer.forEach(element => {
            if(element.id !== myID){
                if(!r1){
                    r1 = new Progress(1, element.name);
                    r1.updateStats(0, 0);
                }else if(!r2){
                    r2 = new Progress(2, element.name);
                    r2.updateStats(0, 0);
                }else if(!r4){
                    r4 = new Progress(4, element.name);
                    r4.updateStats(0, 0);
                }else if(!r5){
                    r5 = new Progress(5, element.name);
                    r5.updateStats(0, 0);
                }
            }
        });
    });

    socket.on('startRace', ()=>{
        console.log('race bhaga');
    });

    socket.on('wpm', data =>{
        r1.animateProgress(cd);
        r2.animateProgress(cd);
        r4.animateProgress(cd);
        r5.animateProgress(cd);
    });
});