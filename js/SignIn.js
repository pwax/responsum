$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    $("#signInButton").click(function () {
        // //User registraion ------
        console.log("logging in...")
        var user = new Parse.User();
        var username = document.getElementById("emailInput").value;
        var password = document.getElementById("passwordInput").value;

        Parse.User.logIn(username, password, {
            success: function(user) {
                // Hooray! Let them use the app now.
                console.log("successfully logged in ");

                //redirect to dashboard
                window.location.replace("dashboard.html");

            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });
});



