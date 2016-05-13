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
    board = initJson;
    setHistory();
    setArray();
    setInitFigures();
    setLettersAndDigits();
    initializeUI();
    setFooter();
    setMoveSide();
    setButtonsEvents();
    if (window.location.pathname == "/openings/index") {
        isOpeningMode = true;
    }
});

var isComputerMove = false;
var isOpeningMode = false;
var jsonHistory = "";
var board = null;
var beforeMove = [];
var afterMove = [];
var afterMoveToSubmit = [];
var beforeMoveToSubmit = [];
var fullMove = null;
var moveIsReadyForSubmit = false;
var history_ar = [];
var messages_ar = [];
var whiteMove = true;
var boardLetters = "abcdefgh";
var boardDigits = "87654321";
var initJson = {};
var leftTopCorner = [];
var Constants = {
    CellWidth : 53
};