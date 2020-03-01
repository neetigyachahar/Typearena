$('document').ready(()=>{
    let signup = $('.noSignUpPrompt');
    let nav = $('nav > div:nth-child(2) li:nth-child(2) a');   
    let close = $('#cross');
    if(nav.length){
        nav.click((evt)=>{
            evt.preventDefault();
            signup.toggleClass('noSignUpPrompt signup');
        });

        close.click(()=>{
            signup.toggleClass('signup noSignUpPrompt');
        });

    }
});