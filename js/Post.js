var postId = getURLParameter("postId")
var postName = getURLParameter("postName")
var boardName = getURLParameter("boardName")
var boardId = getURLParameter("boardId")

$(document).ready(function () {

    Parse.initialize("8f5d3fea-573c-4a82-8f9e-5e2873cc6d52");
    Parse.serverURL = 'http://responsum.herokuapp.com/parse';

    //setup nav bar

    $("#navBar").append("<li role='presentation' class=''><a href='board.html?boardId=" + boardId + "&boardName="+boardName+"'>"+boardName+"</a></li><li role='presentation' class='nav navbar-brand icon ion-ios-arrow-right text-center'><a href=''></a></li><li role='presentation' class='active'><a href=''>"+postName+"</a></li>")

    //configure post
    configurePost(postId);

    //get comments
    var Post = Parse.Object.extend("Post")
    var currentPost = new Post();
    currentPost.id = postId
    queryComments(currentPost);

    //post comment
    $("#postCommentButton").click(function(){
        console.log("post comment button pressed ")
        var bodyString = document.getElementById("commentBody").value
        if (bodyString){
            $('#commentBody').val('');
            var Post = Parse.Object.extend("Post")
            var currentPost = new Post();
            currentPost.id = postId

            var Comment = Parse.Object.extend("Comment")
            var newComment = new Comment();
            newComment.set("body", bodyString)
            newComment.set("post", currentPost)
            newComment.set("owner", Parse.User.current())
            newComment.set("ownerName", Parse.User.current().get("name"))
            newComment.save(null, {
                success: function(post) {
                    console.log("saved post")
                    var Post = Parse.Object.extend("Post")
                    var currentPost = new Post();
                    currentPost.id = postId
                    queryComments(currentPost);
                },
                error: function(newBoard, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new comment ' + error.message);
                }
            });
        }

    })


})

//for configuring our post
function configurePost(postId){
    //query the post
    var Post = Parse.Object.extend("Post")
    var postQuery = new Parse.Query(Post)
    postQuery.get(postId,{
        success:function(fetchedPost){
            //update page
            $("#postTitle").append(fetchedPost.get("title"));
            $("#postBody").append(fetchedPost.get("body"));
        },
        error:function(error){
            console.log("error querying posts: "+JSON.stringify(error))
        }
    })

}

function queryComments(post){

    //query our comments
    var Comment = Parse.Object.extend("Comment")
    var commentQuery = new Parse.Query(Comment)

    commentQuery.equalTo("post", post)
    commentQuery.descending("createdAt")
    $("#commentContainer").html("");
    commentQuery.find({
        success:function(fetchedComments){
            for (var i = 0; i < fetchedComments.length; i++) {
                var fetchedComment = fetchedComments[i]
                var name = fetchedComment.get("ownerName")
                var createdAtDate = new Date(fetchedComment.get("createdAt")).toDateString();
                var body = fetchedComment.get("body")
                configureComment(name, createdAtDate, body)
            }
        },
        error:function(error){
            console.log("error getting comments "+ JSON.stringify(error));
        }
    })

}

function configureComment(ownerName, date, body){

    var openingTags = "<div class='panel-default'><div class='panel-heading'><div class='row panel-heading'>"
    var nameTags = "<div id='posteeInfoContainer' class='col-md-10'><h4 id='posteeName' class='name'>"+ownerName+"</h4></div>"
    var dateTags = "<div id='postDateContainer' class = 'col-xs-2'><h4 id='postDate'><small>"+date+"</small></h4></div></div></div>"
    var bodyTags = "<div class='panel-body'><div class = 'container'><div class = 'container' id='postComment'><h4>"+body+"</h4></div></div></div>"
    var closingTags = "</div></div></div>"

    var comment = openingTags+nameTags+dateTags+bodyTags+closingTags

    $("#commentContainer").append(comment);

}



//for parsing whatever parameters we have in the url
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}