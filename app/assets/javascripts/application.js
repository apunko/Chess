// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require turbolinks
//= require_tree .


$(function() {
    initJson = JSON.parse($("#jsongame").text());
    //history = JSON.parse($("#jsonhistory").text());
    board = initJson;
    setArray();
    setInitFigures();
    setLettersAndDigits();
    initializeUI();
});

var board = null;
var beforeMove = [];
var afterMove = [];
var afterMoveToSubmit = [];
var beforeMoveToSubmit = [];
var fullMove = null;
var moveIsReadyForSubmit = false;
var history_ar = [];
var history_length = 0;
var whiteMove = true;

function initializeUI(){
    $( ".draggable" ).draggable({
        containment: 'parent',
        start: function(event, ui) {
            //if (moveIsReadyForSubmit && false) return;
            var position = ui.position;
            beforeMove = getMove(getCentral(position), $(this).attr("figuretype"));;
        },
        drag: function(event, ui) {
            if(moveIsReadyForSubmit && false) return false;
        },
        stop: function(event, ui){
            position = ui.position;
            afterMove = getMove(getCentral(position), $(this).attr("figuretype"));
            if (beforeMove[1][0] == "w" && whiteMove){
                whiteMove = false;
            }
            else if(beforeMove[1][0] == "b" && !whiteMove) {
                whiteMove = true;
            }
            else {
                revertMove(beforeMove, afterMove);
                return;
            }
            if (moveIsReadyForSubmit && false) return;
            if (!moveIsReadyForSubmit && isMovePossible(beforeMove, afterMove) || true){
                afterMoveToSubmit = afterMove;
                beforeMoveToSubmit = beforeMove;
                setPosition($(this), afterMove[0], beforeMove[0]);

                fullMove = getFullMove(beforeMove, afterMove);
                changeBoardState(beforeMove, afterMove);
                changeHistoryState(fullMove);

                moveIsReadyForSubmit = true;
                disableButtons(false);
            }
            else {
                revertMove(beforeMove);
                if (!moveIsReadyForSubmit){
                    disableButtons(true);
                }
            }
        }
    });
    setButtonsEvents();
    disableButtons(true);
}

function getFullMove(bMove, aMove) {
    var fMove = bMove[1][1]+bMove[0]+aMove[0];
    if (board[aMove[0]] != undefined) {
        fMove += "x"+board[aMove[0]][1];
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
    board[bMove[0]] = undefined;
    board[aMove[0]] = aMove[1];
}

function changeHistoryState(fMove) {
    history_ar.push(fullMove);
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

function isMovePossible(beforeMove, afterMove){
  switch(beforeMove[1]) {
    case "wp":
      return true;
    default:
        return true;
  }
}

function setButtonsEvents(){
    $("#SubmitMoveButton").click(function() {
      debugger;
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
    revertMove(afterMove);
    disableButtons(true);
    });
    $("#SubmitOpeningLine").click(function() {
        debugger;
        $.ajax({
            type: "PATCH",
            url: document.URL,
            data: {
                history: history_ar
            }
        });
        moveIsReadyForSubmit = false;
        disableButtons(true);
    });
}

function revertMove(bMove, aMove){
  var elem = $("." + bMove[0]);
  setPosition(elem, bMove[0], aMove[0]);
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

var initJson = {};

var leftTopCorner = [];

function setInitFigures(){
    for (var key in initJson) {
        var value = initJson[key];
        createElementFigure(key, value);
    }
}

function  createElementFigure(key, value){
    var newDiv = $("<div class='draggable' figuretype="+value+"></div>").addClass(value).addClass(key).addClass("figure");
    newDiv = setPosition(newDiv, key);
    $("#board").append(newDiv);
}

function setPosition(div, moveKey, prevMoveKey){
    div.addClass(moveKey);
    div.removeClass(prevMoveKey);
    var left = (moveKey[0].charCodeAt(0) - "a".charCodeAt(0));
    left = left*Constants.CellWidth;
    var top = (8 - parseInt(moveKey[1]));
    top = top*Constants.CellWidth;
    div.css({top: top, left: left});
    return div;
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

var Constants = {
  CellWidth : 53
};  

function setNewPosition(elem, position){
  var central = getCentral(position);
  elem.css({top: central.top, left: central.left});   
}

function getCentral(position){
    var newPosition = position;
    for (var i=0; i<leftTopCorner.length; i++){
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

var boardLetters = "abcdefgh";
var boardDigits = "87654321"

function setLettersAndDigits(){
  for (var i = 0; i<boardLetters.length; i++){
    var newDiv = $("<div class='letter'></div>").append(boardLetters[i]);
    newDiv.css({left: 26+i*Constants.CellWidth});
    $("#board").append(newDiv);
  }
  for (var i = 0; i<boardDigits.length; i++){
    var newDiv = $("<div class='digit'></div>").append(boardDigits[i]);
    newDiv.css({top: 16+i*Constants.CellWidth});
    $("#board").append(newDiv);
  }
}