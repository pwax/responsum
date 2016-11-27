var boardId = getURLParameter("boardId")
var boardName = getURLParameter("boardName")

$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    //setup nav bar
    $("#navBar").append("<li role='presentation' class='active'><a href=''>"+boardName+"</a></li>")
    configureBoard(boardId, Parse.User.current())

    //hide our join error
    $("#joinBoardError").hide();

    $("#joinBoardButton").click(function(){
        console.log("join board")
         var passcodeString = document.getElementById("boardPasscodeInput").value
        if (passcodeString){
            console.log(passcodeString);

            //query board for matching id and passcode
            var Board = Parse.Object.extend("Board")
            var currentBoard = new Board()
            currentBoard.id = boardId

            var boardQuery = new Parse.Query(Board)
            boardQuery.equalTo("board", currentBoard)
            boardQuery.equalTo("passcode", passcodeString)


        }else{
            console.log("no passcode");
            //show error
            $("#joinBoardError").show();
            $("#joinBoardErrorText").html("Please enter a passcode")
        }
    });

    $("#submitNewPostButton").click(function(){
        var Post = Parse.Object.extend("Post")
        var newPost = new Post()

        var Board = Parse.Object.extend("Board")
        var currentBoard = new Board();
        currentBoard.id = boardId

        var currentUser = Parse.User.current();

        newPost.set("board", currentBoard)
        newPost.set("owner", currentUser);
        newPost.set("ownerName", currentUser.get("name"))
        var bodyString = document.getElementById("postBody").value
        newPost.set("body", bodyString);
        var titleString = document.getElementById("postTitle").value
        newPost.set("title", titleString);

        newPost.save(null, {
            success: function(post) {
                console.log("saved post")
                $('#newPostModal').modal('toggle');
                queryPostsForBoard(currentBoard)
            },
            error: function(newBoard, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new post ' + error.message);
            }
        });

    })


});

function promptForPassword(){
    $("#joinBoardModalTitle").append("Join " + boardName);
    $("#createJoinBoard").modal('show');
}

function configureBoard(boardId, user) {

    //check if we have access to this board
    var Board = Parse.Object.extend("Board")
    var currentBoard = new Board();
    currentBoard.id = boardId;
    var BoardMember = Parse.Object.extend("BoardMember")
    var boardMemberQuery = new Parse.Query(BoardMember);
    boardMemberQuery.equalTo("board", currentBoard)
    boardMemberQuery.equalTo("member", user)
    boardMemberQuery.find({
        success:function (fetchedBoardMembers) {
            if (fetchedBoardMembers.length > 0){
                //we're a member
                //create our button
                var button='<button id="joinBoardButton" class="btn btn-primary " data-toggle="modal" data-target="#newPostModal"><span class="icon ion-plus"></span></button>';
                $("#postActionContainer").append(button);
                $("#fetchedPostContainer").append("<div><h4><small>Loading posts...</h4></small></div>")
                queryPostsForBoard(currentBoard);
            }else{
                //we're not a member, prompt for password
                $("#fetchedPostContainer").append("<div><h4><small>Please sign in the view posts</h4></small></div>")
                promptForPassword()
            }
        },
        error:function(error){
            console.log("error finding board member: "+ JSON.stringify(error));
        }
    })
    $("#boardName").append(boardName)
}

function queryPostsForBoard(board){
    //query our posts
    var Post = Parse.Object.extend("Post")
    var posts = new Post()

    var postQuery = new Parse.Query(posts)
    postQuery.descending("createdAt")
    postQuery.equalTo("board", board)
    postQuery.find({
        success:function(posts){
            if (posts.length > 0){
                console.log("got some posts")
                //deal with the posts
                $("#fetchedPostContainer").html("");
                for (var i = 0; i < posts.length; i++) {
                    var fetchedPost = posts[i];
                    var postName = fetchedPost.get("title");
                    var postId = fetchedPost.id;
                    var ownerName = fetchedPost.get("ownerName");
                    var createdAtDate = new Date(fetchedPost.get("createdAt")).toDateString();
                    $("#fetchedPostContainer").append("<div class='panel'><h3><a href='post.html?postId=" + postId + "&postName="+postName+"&boardName="+boardName+"&boardId="+boardId+"'>"+ postName +" </a><h4><small class='name'>"+ownerName+"</small></h4><h4><small>"+createdAtDate+"</small></h4></div>")
                 }
            }else{
                $("#fetchedPostContainer").html("<div><h4><small>Get started by creating a post</h4></small></div>")
            }
        },
        error:function(error){
            console.log("error querying posts: "+JSON.stringify(error))
        }
    })

}



//for parsing whatever parameters we have in the url
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
