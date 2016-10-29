var boardId = getURLParameter("boardId")
var boardName = getURLParameter("boardName")

$(document).ready(function () {

    //setup nav bar
    $("#navBar").append("<li role='presentation' class='active'><a href=''>"+boardName+"</a></li>")

    configureBoard(boardId)

});

function configureBoard(boardId) {

    $("#boardName").append(boardName)

}

//for parsing whatever parameters we have in the url
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
