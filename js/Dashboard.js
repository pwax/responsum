$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    //hide our elements
    $("#signOutNavButton").hide();
    $("#signInNavButton").hide();
    $("#signInHeader").hide();
    $("#welcomeHeading").hide();

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
        queryBoardsForTeacher(user)
    }

    function configForStudent(user) {
        var button='<button id="joinBoardButton" class="btn btn-primary"><span class="icon ion-plus"></span></button>';
        $("#boardActionContainer").append(button);
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
                    queryBoardsForTeacher(owner)
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
    
    function queryBoardsForTeacher(user) {
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
                    console.log("no boards for teacher")
                }else{
                    for (var i = 0; i < fetchedBoards.length; i++) {
                        var fetchedBoard = fetchedBoards[i];
                        console.log(fetchedBoard)
                        var boardName = fetchedBoard.get("name");
                        var boardId = fetchedBoard.id;
                        $("#fetchedBoardContainer").append("<div class='panel'><h3>" + "<a href='board.html?boardId=" + boardId + "'>"+ boardName +" </a></h3></div>")
                    }
                }
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })

    }

});



