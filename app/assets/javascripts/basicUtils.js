function  createElementFigure(key, value){
    var newDiv = $("<div class='draggable' figuretype="+value+"></div>").addClass(value).addClass(key).addClass("figure");
    newDiv = setPosition(newDiv, key);
    $("#board").append(newDiv);
}

function setPosition(div, moveKey, prevMoveKey){
    div.addClass(moveKey);
    div.removeClass(prevMoveKey);
    var left = (moveKey[0].charCodeAt(0) - "a".charCodeAt(0));
    left = left * Constants.CellWidth;
    var top = (8 - parseInt(moveKey[1]));
    top = top * Constants.CellWidth;
    div.css({top: top, left: left});
    return div;
}

function getCentral(position){
    var newPosition = position;
    for (var i=0; i < leftTopCorner.length; i++){
        var center = {};
        center.top = position.top + Constants.CellWidth/2;
        center.left = position.left + Constants.CellWidth/2;
        if ((leftTopCorner[i].left <= center.left) && (leftTopCorner[i].top <= center.top)) {
            if (((center.left - leftTopCorner[i].left) <= Constants.CellWidth) && ((center.top - leftTopCorner[i].top) <= Constants.CellWidth)){
                newPosition = leftTopCorner[i];
            }
        }

    }
    return newPosition;
}

function revertMoveOnElement(elem, bMove, aMove){
    setPosition(elem, bMove[0], aMove[0]);
}

function revertByFullMove(fMove, wMove){
    debugger;
    var figureType = "";
    if (wMove) {
        figureType = "w";
    }
    else {
        figureType = "b"
    }
    figureType += fMove[0];
    var bPosition = fMove[1] + fMove[2];
    var aPosition = fMove[3] + fMove[4];
    var divFig = $("." + aPosition).first();
    setPosition(divFig, bPosition, aPosition);
    var isTaking = fMove[5];
    if (isTaking){
        var figureToRecreate = fMove[6] + fMove[7];
        createElementFigure(aPosition, figureToRecreate);
        board[aPosition] = figureToRecreate;
        board[bPosition] = figureType;
    }
    else {
        delete board[aPosition];
        board[bPosition] = figureType;
    }
}

function revertMove(bMove, aMove){
    var elem = $("." + aMove[0]);
    setPosition(elem, bMove[0], aMove[0]);
}

function getFullMove(bMove, aMove) {
    var fMove = bMove[1][1] + bMove[0] + aMove[0];
    if (board[aMove[0]] != undefined) {
        fMove += "x" + board[aMove[0]];
    }
    return fMove;
}

function changeBoardState(bMove, aMove){
    var elems = $("."+aMove[0]);
    if (elems.length > 1) {
        if (elems.first().attr("figuretype") != aMove[1]) {
            elems.first().remove();
        }
        else {
            elems.last().remove();
        }
    }
    delete board[bMove[0]];
    board[aMove[0]] = aMove[1];
}

function changeHistoryState(fMove) {
    history_ar.push(fullMove);
    debugger;
    var message = $("#opening_message").val();
    $("#opening_message").val("");
    messages_ar.push(message);
    var lastTr = $("#history").find('tbody').find('tr').last();
    var tds = $(lastTr).find('td');
    if (history_ar.length % 2 == 1){
        $(tds[0]).text((history_ar.length / 2 | 0) + 1);
        $(tds[1]).text(fullMove);
    }
    else {
        $(tds[2]).text(fullMove);
        $("#history").find('tbody').last()
            .append($('<tr>')
                .append($('<td>'))
                .append($('<td>'))
                .append($('<td>'))
            );
    }
}

function setButtonsEvents(){
    $("#SubmitMoveButton").click(function() {
        $.ajax({
            type: "PATCH",
            url: document.URL,
            data: {
                moves:
                {
                    before: beforeMoveToSubmit,
                    after: afterMoveToSubmit
                }
            }
        });
        moveIsReadyForSubmit = false;
        disableButtons(true);
    });
    $("#CancelMoveButton").click(function() {
        debugger;
        moveIsReadyForSubmit = false;
        revertMove(beforeMove, afterMove);
        disableButtons(true);
    });
    $("#SubmitOpeningLine").click(function() {
        debugger;
        $.ajax({
            type: "PATCH",
            url: document.URL,
            data: {
                history: history_ar,
                messages: messages_ar
            }
        });
    });
    $("#RevertMoveButton").click(function() {
        revertMoveFromHistory();
    });
}

function revertMoveFromHistory() {
    debugger;
    var lastMove = history_ar.pop();
    if (messages_ar.length != 0) {
        $("#opening_message").val(messages_ar[messages_ar.length - 1]);
    }
    else {
        $("#opening_message").val("");
    }
    messages_ar.pop();
    if (lastMove != undefined) {
        whiteMove = !whiteMove;
        revertByFullMove(lastMove, (history_ar.length + 1) % 2 == 1);
        deleteLastMoveOnBoardHistory();
    }
}

function deleteLastMoveOnBoardHistory() {
    debugger;
    var lastTr = $("#history").find('tbody').find('tr').last();
    var tds = $(lastTr).find('td');
    if ((history_ar.length + 1) % 2 == 1){
        $(tds[0]).text("");
        $(tds[1]).text("");
    }
    else {
        var trsLength = $("#history").find('tbody').find('tr').length;
        var preLastTr = $("#history").find('tbody').find('tr')[trsLength-2];
        tds = $(preLastTr).find('td');
        $("#history").find('tbody').find('tr').last().remove();
        $(tds[2]).text("");
    }
}

function disableButtons(value){
    disabled = value;
    $("#SubmitMoveButton").attr("disabled", value);
    $("#CancelMoveButton").attr("disabled", value);
}

function getMove(position, figuretype){
    var digit = 8 - position.top / Constants.CellWidth;
    var letter =  "a".charCodeAt(0) + position.left / Constants.CellWidth;
    letter = String.fromCharCode(letter);
    var something = letter + digit;
    var move = [];
    move[0] = something;
    move[1] = figuretype;
    return move;
}
