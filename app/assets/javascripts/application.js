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
  initializeUI();
});

var beforePosition = {};
var afterPosition = {};

function initializeUI(){
  $( ".draggable" ).draggable({
    containment: 'parent',
    start: function(event, ui) {
      var position = ui.position;
      beforeMove = getMove(getCentral(position), $(this).attr("figuretype"));
    }, 
    stop: function(event, ui){
      position = ui.position; 
      afterMove = getMove(getCentral(position), $(this).attr("figuretype"));
      setPosition($(this), Object.keys(afterMove)[0], Object.keys(beforeMove)[0]);
      disableButtons(false);
    }
  });
  $("#SubmitMoveButton").click(function() {
    console.log(afterMove);
    disableButtons(true);
  });
  $("#CancelMoveButton").click(function() {
    console.log(beforeMove);
    revertMove();
    disableButtons(true);
  });
  disableButtons(true);
}

function revertMove(){
  debugger;
  for (var key in afterMove){
    var elem = $("."+key);
    setPosition(elem, Object.keys(beforeMove)[0], key);
  }
}

function disableButtons(value){
  $("#SubmitMoveButton").attr("disabled", value);
  $("#CancelMoveButton").attr("disabled", value);
}

function getMove(position, figuretype){
    var digit = 8 - position.top / Constants.CellWidth; 
    var letter =  "a".charCodeAt(0) + position.left / Constants.CellWidth;
    letter = String.fromCharCode(letter);
    var something = letter + digit;
    var move = {};
    move[something] = figuretype;
    return move;
}

var initJson = {}    

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

