$('document').ready(()=>{
    let socket = io.connect('http://localhost:5000/race');
    socket.on('welcome',function(data) {
        console.log(data);
    });
});