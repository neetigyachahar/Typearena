let cd = 0;
let cc = 0;
let tmr = 0;
let wrd = 0;
let wpm = 140;  //little high value to get right speed of meter
let word_ptr = 1;
let lst_ptr = 0;
let err = 0;
let charTyped;
let started = false;
let ended = false;
let err_ack = false;
let accracy = 0;
let data = `We were the people. We lived in the blank white spaces at the edges of print.We were the people who were not in the papers. We lived in the blank white spaces at the edges of print.`;
let lst = data.trim().split(' ');
let text_len = data.trim().length;
let limit = lst.length - 1;
let r1,r2, r3, r4, r5;

lst.forEach((item, index) =>{
    if(index != lst.length -1)
          lst[index] = item+' ';
});

$('document').ready(()=>{
    r1 = new Progress(1, {'name':'Neetigya', 'id': 0});
    r2 = new Progress(2, {'name':'Neetigya', 'id': 0});
    r3 = new Progress(3, {'name':'Neetigya', 'id': 0});
    r4 = new Progress(4, {'name':'Neetigya', 'id': 0});
    r5 = new Progress(5, {'name':'Neetigya', 'id': 0});

    initializeText(data);
    start();




});

function immortalize(i){
    if($(".ty").val().length <= lst[lst_ptr][word_ptr-1].length){
        $(".ty").val(lst[lst_ptr][word_ptr-1]);
    }
}

function error(){
    err++;
}

function timer(){
    if(started){       
        setTimeout(()=>{
            tmr += 1;                
            wpm = Math.round(cc*12/tmr);
            accracy = ((cd - err)*100/cd).toFixed(2);
            if(accracy < 0){
                accracy = 0;
            }
            $('.wpm').text(`${wpm}`);
            $('.error').text(`${accracy}%`);
            timer();
        }, 1000);
    }else{
        //after race end functions could be introduced here.
        return;
    }
};

function start(){
    $('.ty').bind('input',(evt)=>{
        if(!ended){
        if(!started){
            started = true;
            timer();
        }
        
        //This code checks if inital spaces are added or not!
        if (!$('.ty').val().replace(/\s/g, '').length) {
            evt.preventDefault();
            $('.ty').val(''); 
            return;
        }
        
        evt = evt || window.event;
        charTyped = String.fromCharCode(evt.which || evt.keyCode);
        ty_data = $('.ty'); 

        //matches for the correct input
        if(ty_data.val() == lst[lst_ptr].substring(0, word_ptr)){

            //checks if there was any error or not.
            if(err_ack){
                console.log('afdadfasdfadfasdfsadfsadfasdfasdfadsf');
                err_ack = false;
            }

            cd += 1;

            movCursor(lst, lst_ptr, word_ptr);
            r1.animateProgress(cd, text_len);
            r2.animateProgress(cd, text_len);
            r3.animateProgress(cd, text_len);
            r4.animateProgress(cd, text_len);
            r5.animateProgress(cd, text_len);

            //check if last chracter of word is reached
            if(word_ptr == lst[lst_ptr].length){           
                $('.ty').val(''); 
                cc = cd;

                //checks if last character is of the text is reached or not.
                if(lst_ptr == limit){
                    started = false;
                    ended = true;
                    return;
                }
                word_ptr = 1;
                lst_ptr += 1;     
            }else{
                word_ptr = ty_data.val().length + 1;
            }
        }else{
            if(!err_ack){
                err_ack= true;
                error();
                immortalize(word_ptr-1);
            }
        }
        }else{
            //something
        }
    });
}


class Progress{
    constructor(i, user){ //user has name and ID
        this.i = i;
        this.index = `#progress${i} > div:nth-child(1)`;
        this.name = user.name;
        this.id = user.id;
        this.svgDes = new ProgressBar.Circle(this.index, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 0,
            from: { color: 'rgba(255,255,255,1)' },
            to: { color: 'rgba(255 ,0 ,0 ,1)' },
            step: function(state, circle, attachment) {
                circle.path.setAttribute('stroke', state.color);
            },
            trailColor: '#121212',
            trailWidth: 0.02,
            svgStyle: null
          });
          this.populate();
    }

    populate(){
        $(`#progress${this.i} > div:nth-child(2) > div:nth-child(1)`).text(this.name);
        $(`#progress${this.i} .error`).text('100%');
        $(`#progress${this.i} .wpm`).text('0');
    }

    blinkStop() {
        console.log('stoping blink...');
    }

    updateWPM(s){
        //update wpm
    }

    animateProgress(written, total){
        this.svgDes.animate(written/total);
    }
    
    test(){
        
    }
}

function initializeText(data){
    console.log(data.slice(0, 1));
    $('.cursor').text(data.slice(0, 1));
    $('.tbt').text(data.slice(1, data.length));
}

function movCursor(lst, lp, wp){
    if(lp == lst.length-1 && wp == lst[lp].length){
        $('.typed').text(lst.slice(0, lp).join('')+lst[lp].substring(0, wp));  
        $('.cursor').text('');
        return;
    }
    if(lst[lp].length == wp){
        lp++;
        wp = 0;
    }
    $('.typed').text(lst.slice(0, lp).join('')+lst[lp].substring(0, wp));
    $('.cursor').text(lst[lp][wp]);
    $('.tbt').text(lst[lp].substring(wp+1, lst[lp].length) + lst.slice(lp+1, lst.length).join(''));
}


function bot(){
    let ptr = 0;
    setInterval(() => {
        if(ptr < data.length){
            $('.ty').val($('.ty').val()+data[ptr]);
            // let e = $.Event("keypress", { which: 65, keyCode: 65 });
            $('.ty').trigger('input');
            ptr++;
        }
    },60);
}

function teset(){
    
}