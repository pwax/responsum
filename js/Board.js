var boardId = getURLParameter("boardId")

$(document).ready(function () {



});

function configureBoard(board) {

}

//for parsing whatever parameters we have in the url
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
