$('document').ready(()=>{
    let cd = 0;
    let cc = 0;
    let tmr = 0;
    let wrd = 0;
    let wpm = 0;
    let word_ptr = 1;
    let lst_ptr = 0;
    let err = 0;
    let charTyped;
    let started = false;
    let ended = false;
    let err_ack = false;
    let lst = $('.text').text().split(' ');
    let text_len = $('.text').text().length;
    let limit = lst.length - 1;

    lst.forEach((item, index) =>{
        if(index != lst.length -1)
              lst[index] = item+' ';
    });
    
    // $('.ty').focus(bot);
    console.log('afadfasdfasdf');

    $('.ty').bind('input',(evt)=>{
        if(!ended){
        if(!started){
            started = true;
            timer();
        }
        console.log($('.ty').val().replace(/\s/g, '').length);

        //This code checks if inital spaces are added or not!
        if (!$('.ty').val().replace(/\s/g, '').length) {
            console.log('afa');
            evt.preventDefault();
            $('.ty').val(''); 
            return;
        }

        evt = evt || window.event;
        charTyped = String.fromCharCode(evt.which || evt.keyCode);
        ty_data = $('.ty'); 
        console.log(ty_data.val()+charTyped);
        console.log('data', ty_data.val(), lst[lst_ptr]); 
        if(ty_data.val() == lst[lst_ptr].substring(0, word_ptr)){   //substring matched
            if(err_ack){
                $('.error').text('');
                err_ack = false;
            }
            cd += 1;
            r1.animateProgress(cd, text_len);
            console.log('hey' ,word_ptr, lst[lst_ptr]);
            if(word_ptr == lst[lst_ptr].length){           
                $('.ty').val(''); 
                cc = cd;
                
                if(lst_ptr == limit){
                    started = false;
                    ended = true;
                    return;
                }
                console.log('say hi');
                word_ptr = 1;
                lst_ptr += 1;          
            }else{
                console.log('aaya', word_ptr);
                word_ptr = ty_data.val().length + 1;
            }
        }else{
            if(!err_ack){
                err_ack= true;
                error();
            }
        }
        // if(cd % 5 == 0){
        //     wrd += 1;
        // }
        }else{
            //something
        }
    });

    function error(){
        err++;
    }

    function match(a, b){
        let bi = 0;
        for(ai = 0; ai < a.length; ai++){
            if(a[ai] != b[bi]){
                return false;
            }else{
                if(ai == a.length - 1){
                    return true;
                }
                bi++;
            }
        }
    }

    function timer(){
        if(started){       
            setTimeout(()=>{
                tmr += 1;                
                console.log('From timer function: '+ tmr);
                $('.wpm').text(`${Math.round(cc*12/tmr)}`);
                $('.error').text(`${((cd - err)*100/cd).toFixed(2)}%`);
                timer();
            }, 1000);
        }else{
            //after race end functions could be introduced here.
            return;
        }
    };

    let r1 = new Progress(3, {'name':'Neetigya', 'id': 0});
});



class Progress{
    constructor(i, user){ //user has name and ID
        this.i = i;
        this.index = `#progress${i} > div:nth-child(1)`;
        this.name = user.name;
        this.id = user.id;
        this.svgDes = new ProgressBar.Circle(this.index, {
            strokeWidth: 6,
            easing: 'easeInOut',
            duration: 1400,
            from: { color: 'rgba(255,255,255,1)' },
            to: { color: 'rgba(255 ,0 ,0 ,1)' },
            step: function(state, circle, attachment) {
                circle.path.setAttribute('stroke', state.color);
            },
            trailColor: '#eee',
            trailWidth: 0.2,
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



function bot(){
    let data = $('.text').text();
    let ptr = 0;
    setInterval(() => {
        if(ptr < data.length){
            $('.ty').val($('.ty').val()+data[ptr]);
            // let e = $.Event("keypress", { which: 65, keyCode: 65 });
            $('.ty').trigger('input');
            ptr++;
        }
    }, 330);
}