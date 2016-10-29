$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    var jumboHeight = $('.jumbotron').outerHeight();
    function parallax(){
        var scrolled = $(window).scrollTop();
        $('.bg').css('height', (jumboHeight-scrolled) + 'px');
    }

    $(window).scroll(function(e){
        parallax();
    });

    var currentUser = Parse.User.current();
    if (currentUser){
        console.log("user is logged in");
        //update our buttons
        $("#signOutNavButton").show();
        $("#signInNavButton").hide();

    }else{
        console.log("no user");
        $("#signOutNavButton").hide();
        $("#signInNavButton").show();
        //update heading
    }
});
