$('document').ready(()=>{   
    if($('.navLogin').length){
        let login = $('.noLoginPrompt');
        let nav = $('.navLogin');   
        let close = $('#crossLogin');
        if(nav.length){
            nav.click((evt)=>{
                evt.preventDefault();
                login.toggleClass('noLoginPrompt login');
            });

            close.click(()=>{
                login.toggleClass('login noLoginPrompt');
            });

        }


        $('.loginSubmitBtn').submit(evn =>{
            $('.loginStatus').text('');
            var credentials = $(".loginForm").serialize();
            $.ajax({
                type: "POST",
                url: "/login",
                data: credentials,
                success: function(data) {
                    $('.loginStatus').text(data.message);
                    if(data.redirect){
                        $('.loginStatus').css('color', 'white');
                        $('.loginStatus').css('font-size', '1.2rem');
                        $('.loginStatus').text(data.message);
                        setTimeout(()=>{
                            location.reload();
                        }, 1000);
                    }
                }
            });
        });
    }
});