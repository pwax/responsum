
Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
Parse.serverURL = 'http://responsum.herokuapp.com/parse';

//
//$("#learnMoreButton").click(function(){
//    console.log("learn more pressed");
//    var TestObject = Parse.Object.extend("TestObject");
//    var testObject = new TestObject();
//    testObject.save({foo: "bar"}).then(function(object) {
//        alert("yay! it worked");
//    });
//});


//User registraion ------
var user = new Parse.User();
var name = document.getElementById("signUpForm").elements["nameInput"];
var email = document.getElementById("signUpForm").elements["emailInput"];
var password = document.getElementById("signUpForm").elements["passwordInput"];

user.set("username", email);
user.set("email", email);
user.set("password", password);

user.signUp(null, {
    success: function(user) {
        // Hooray! Let them use the app now.
        alert("registered user: " + name);
    },
    error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
    }
});