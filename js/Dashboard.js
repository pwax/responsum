$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    //hide our elements
    $("#signOutNavButton").hide();
    $("#signInNavButton").hide();
    $("#signInHeader").hide();
    $("#welcomeHeading").hide();

    //show loading indicator
    var target = document.getElementById("boardsLoadingIndicator")
    var spinner = new Spinner(loadingIndicatorOpts).spin(target);

    var currentUser = Parse.User.current();
    if (currentUser){
        console.log("user is logged in");
        //load data for current user
        configForUser(currentUser)
        //update our buttons
        $("#signOutNavButton").show();
        $("#signInNavButton").hide();

    }else{
        console.log("no user");
        $("#signInModal").modal('show')
        $("#signOutNavButton").hide();
        $("#signInNavButton").show();
        //update heading
        $("#welcomeHeading").text("Please sign in to view your dashboard")
    }

    function configForUser(user) {
        console.log(user.get("name"));
        //update heading
        $("#welcomeHeading").show();
        $("#welcomeHeading").text("Welcome, " + user.get("name"));

        //update based on either student or teacher
        var isTeacher = user.get("isTeacher");
        if (isTeacher == true){
            configForTeacher(user)
        }else{
            configForStudent(user)
        }

    }

    function configForTeacher(user) {
        //create "new board" button
        var button='<button id="createNewBoardButton" class="btn btn-primary" data-toggle="modal" data-target="#createBoardModal">' +
            '<span class="icon ion-plus"></span></button>';
        $("#boardActionContainer").append(button);

        //query boards
        queryBoardsForUser(user)
    }

    function configForStudent(user) {
        var button='<button id="joinBoardButton" class="btn btn-primary" data-toggle="modal" data-target="#newPostModal"><span class="icon ion-plus"></span></button>';
        var button='<button id="joinBoardButton" class="btn btn-primary" data-toggle="modal" data-target="#createSearchModal"><span class="icon ion-plus"></span></button>';
        $("#boardActionContainer").append(button);
        //query boards
        queryBoardsForUser(user);
    }

    //creating a new board
    $("#finalCreateBoardButton").click(function () {
        console.log("creating new board...")

        var Board = Parse.Object.extend("Board");
        var newBoard = new Board();

        //setup our board
        var owner = Parse.User.current();
        var name = document.getElementById("boardNameInput").value;
        var passcode = document.getElementById("boardPasscodeInput").value;

        newBoard.set("owner", owner);
        newBoard.set("name", name);
        newBoard.set("passcode", passcode);

        if (!name|| !passcode){
            alert("Please be sure to enter a name and passcode")
        }else{
            newBoard.save(null, {
                success: function(board) {
                    // Execute any logic that should take place after the object is saved.
                    queryBoardsForUser(owner)
                    $('#createBoardModal').modal('toggle');
                },
                error: function(newBoard, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }

    });

    function queryBoardsForUser(user) {
        console.log("querying for teacher...")
        var Boards = Parse.Object.extend("Board");
        var teacherBoardsQuery = new Parse.Query(Boards);
        teacherBoardsQuery.descending("createdAt");
        teacherBoardsQuery.equalTo("owner", {
            __type: "Pointer",
            className: "_User",
            objectId: user.id
        });
        teacherBoardsQuery.find({
            success:function (fetchedBoards) {
                //got our boards for the teacher
                //clear out if we have any
                $("#fetchedBoardContainer").html("")
                if (fetchedBoards.length <= 0){
                    console.log("no boards")
                    spinner.stop();

                    var boardHelpString;
                    if (user.get("isTeacher") == true){
                        boardHelpString = "Get started by creating a board"
                    }else{
                        boardHelpString = "Get started by joining a board"
                    }

                    $("#fetchedBoardContainer").append("<div><h4><small>"+boardHelpString+"</h4></small></div>")

                }else{
                    for (var i = 0; i < fetchedBoards.length; i++) {
                        var fetchedBoard = fetchedBoards[i];
                        console.log(fetchedBoard)
                        var boardName = fetchedBoard.get("name");
                        var boardId = fetchedBoard.id;
                        $("#fetchedBoardContainer").append("<div class='panel'><h3>" + "<a href='board.html?boardId=" + boardId + "&boardName="+boardName+"'>"+ boardName +" </a></h3></div>")
                    }
                }
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })

    }

});

var loadingIndicatorOpts = {
    lines: 11 // The number of lines to draw
    , length: 30 // The length of each line
    , width: 7 // The line thickness
    , radius: 28 // The radius of the inner circle
    , scale: 0.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.05 // Opacity of the lines
    , rotate: 12 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1.2 // Rounds per second
    , trail: 72 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}
