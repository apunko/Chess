function initializeUI(){
    $( ".draggable" ).draggable({
        containment: 'parent',
        start: function(event, ui) {
            $(this).zIndex(10);
            var position = ui.position;
            beforeMove = getMove(getCentral(position), $(this).attr("figuretype"));;
        },
        drag: function(event, ui) {},
        stop: function(event, ui) {
            position = ui.position;
            afterMove = getMove(getCentral(position), $(this).attr("figuretype"));
            setPosition($(this), afterMove[0], beforeMove[0]);
            debugger;
            if (!((beforeMove[1][0] == "w" && whiteMove) || (beforeMove[1][0] == "b" && !whiteMove))) {
                revertMoveOnElement($(this), beforeMove, afterMove);
                return;
            }
            fullMove = getFullMove(beforeMove, afterMove);
            debugger;
            if (ChessUtils.moveIsPossible(fullMove, true)) {
                changeBoardState(beforeMove, afterMove);
                changeHistoryState(fullMove);
                whiteMove = !whiteMove;
            }
            else {
                revertMoveOnElement($(this), beforeMove, afterMove);
            }
            $(this).zIndex(5);
        }
    });
    setButtonsEvents();
    disableButtons(true);
}

function setArray(){
    for (var i=0; i<8; i++){
        for (var j=0; j<8; j++){
            var ob = {};
            ob.top = i*Constants.CellWidth;
            ob.left = j*Constants.CellWidth;
            leftTopCorner.push(ob);
        }
    }
    leftTopCorner.reverse();
}

function setInitFigures(){
    for (var key in initJson) {
        var value = initJson[key];
        createElementFigure(key, value);
    }
}

function setLettersAndDigits(){
    for (var i = 0; i < boardLetters.length; i++){
        var newDiv = $("<div class='letter'></div>").append(boardLetters[i]);
        newDiv.css({left: 26 + i * Constants.CellWidth});
        $("#board").append(newDiv);
    }
    for (var i = 0; i < boardDigits.length; i++){
        var newDiv = $("<div class='digit'></div>").append(boardDigits[i]);
        newDiv.css({top: 16 + i*Constants.CellWidth});
        $("#board").append(newDiv);
    }
}