

$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    $("#registerButton").click(function () {
        // //User registraion ------
        console.log("registering new user...")
        var user = new Parse.User();
        var name = document.getElementById("nameInput").value;
        var email = document.getElementById("formEmailInput").value;
        var password = document.getElementById("formPasswordInput").value;
        var isTeacher = document.getElementById("isTeacher").checked;


        user.set("name", name);
        user.set("username", email);
        user.set("email", email);
        user.set("password", password);
        user.set("isTeacher", isTeacher);

        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                console.log("successfully registered " + name);

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



