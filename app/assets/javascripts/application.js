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
//= require turbolinks
//= require_tree .


$(function() {
  initJson = JSON.parse($("#jsongame").text())
  setArray();
  setInitFigures();
  setLettersAndDigits();
  initializeUI();

});

var beforeMove = [];
var afterMove = [];
var afterMoveToSubmit = [];
var beforeMoveToSubmit = [];
var moveIsReadyForSubmit = false;

function initializeUI(){
  $( ".draggable" ).draggable({
    containment: 'parent',
    start: function(event, ui) {
      if (moveIsReadyForSubmit) return;
      var position = ui.position;
      beforeMove = getMove(getCentral(position), $(this).attr("figuretype"));
    }, 
    drag: function(event, ui) { if(moveIsReadyForSubmit) return false; },
    stop: function(event, ui){
      if (moveIsReadyForSubmit) return;
      position = ui.position; 
      afterMove = getMove(getCentral(position), $(this).attr("figuretype"));
      if (!moveIsReadyForSubmit && isMovePossible(beforeMove, afterMove)){
        afterMoveToSubmit = afterMove;
        beforeMoveToSubmit = beforeMove;
        setPosition($(this), afterMove[0], beforeMove[0]);
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

function isMovePossible(beforeMove, afterMove){
  switch(beforeMove[1]) {
    case "wp":
        return true;
    default:
        return false;
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
    revertMove(afterMove);
    disableButtons(true);
  });
}

function revertMove(first){
  var elem = $("."+first[0]);
  setPosition(elem, beforeMove[0], afterMove[0]);
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