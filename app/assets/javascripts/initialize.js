function setHistory() {
    debugger;
    if ($("#gameHistory").length > 0){
        if ($("#gameHistory").text().trim() != ""){
            jsonHistory = JSON.parse($("#gameHistory").text());
            debugger;
            history_ar = jsonHistory;
            fillHistoryTable(history_ar);
        }
    }
}

function setMoveSide() {
    if ($("#isComputerMove").length > 0){
        if ($("#isComputerMove").text().trim() == "true"){
            isComputerMove = true;
        }
    }
}

function fillHistoryTable(history_array) {
    for (var i = 0; i < history_array.length; i++){
        addMoveToHistoryTable(history_array[i], i);
    }
}

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
            var position = ui.position;
            afterMove = getMove(getCentral(position), $(this).attr("figuretype"));
            setPosition($(this), afterMove[0], beforeMove[0]);
            debugger;
            if (isComputerMove) {
                revertMoveOnElement($(this), beforeMove, afterMove);
                $(this).zIndex(5);
                return;
            }
            if (!((beforeMove[1][0] == "w" && whiteMove) || (beforeMove[1][0] == "b" && !whiteMove))) {
                revertMoveOnElement($(this), beforeMove, afterMove);
                $(this).zIndex(5);
                return;
            }
            fullMove = getFullMove(beforeMove, afterMove);
            debugger;
            if (ChessUtils.moveIsPossible(fullMove, true)) {
                whiteMove = !whiteMove;
                isComputerMove = !isComputerMove;
                changeHistoryState(fullMove);
                changeBoardState(beforeMove, afterMove);
            }
            else {
                revertMoveOnElement($(this), beforeMove, afterMove);
            }
            $(this).zIndex(5);
        }
    });
}

function makeMoveByFullMove(fMove) {
    var bMove = fMove[1] + fMove[2];
    var aMove = fMove[3] + fMove[4];
    var elem = $("." + bMove);
    makeMoveByPositions(elem, bMove, aMove, fMove);
}

function makeMoveByPositions(elem, beforeMove, afterMove, fullMove) {
    debugger;
    setPosition($(elem), afterMove, beforeMove);
    var figureType = "b";
    if (whiteMove) {
        figureType = "w";
    }
    figureType += fullMove[0];
    whiteMove = !whiteMove;
    isComputerMove = !isComputerMove;
    changeBoardState([beforeMove, figureType], [afterMove, figureType]);
    changeHistoryState(fullMove);
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

function setFooter(){
    $(window).resize(function () {
        if ($(document).height() > $(window).height()) {
            $("#footer").removeClass("navbar-fixed-bottom");
        }
        else {
            $("#footer").addClass("navbar-fixed-bottom");
        }
    });
    if ($(document).height() > $(window).height()) {
        $("#footer").removeClass("navbar-fixed-bottom");
    }
    else {
        $("#footer").addClass("navbar-fixed-bottom");
    }
}