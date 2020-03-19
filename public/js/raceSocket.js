$('document').ready(()=>{
    let socket = io.connect('http://localhost:5000/race');
    let myID = $('.userID').val();

    socket.on('welcome', function(newRacer){
        console.log(newRacer);
        newRacer.forEach(element => {
            if(element.id !== myID){
                if(!r1){
                    r1 = new Progress(1, element.name);
                }else if(!r2){
                    r2 = new Progress(2, element.name);
                }else if(!r4){
                    r4 = new Progress(4, element.name);
                }else if(!r5){
                    r5 = new Progress(5, element.name);
                }
            }
        });
    });

    socket.on('startRace', ()=>{
        console.log('race bhaga');
    });
});