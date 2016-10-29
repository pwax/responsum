$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    $("#signOutButton").click(function () {
        Parse.User.logOut().then(() => {
            var currentUser = Parse.User.current();
            console.log("logged out user");
            window.location.replace("index.html");
        });
    });
});
