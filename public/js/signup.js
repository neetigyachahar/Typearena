$('document').ready(()=>{
    if(!$('.navSignup').length){
        return;
    }
    let signup = $('.noSignUpPrompt');
    let nav = $('.navSignup');   
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


    $('.signupForm > button').click(evn=>{
        $('.signupStatus').text('');

        var credentials = $(".signupForm").serialize();
        $.ajax({
            type: "POST",
            url: "/signup",
            data: credentials,
            success: function(data) {
                $('.signupStatus').text(data.message);
                if(data.redirect){
                    $('.signupStatus').css('color', 'white');
                    $('.signupStatus').css('font-size', '1.2rem');
                    $('.signupStatus').text(data.message);
                    setTimeout(()=>{
                        location.reload(true);
                    }, 2000);
                }
            }
        });
    });
});