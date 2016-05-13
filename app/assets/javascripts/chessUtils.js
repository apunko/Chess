var instanceBoard = [];
var ChessUtils = {
    moveIsPossible : function(fMove, check) {
        if (movementIsPossible(fMove)){
            if (check) {
                var figureType = "";
                if (whiteMove) {
                    figureType = "w";
                }
                else {
                    figureType = "b";
                }
                figureType += fMove[0];
                var bPosition = fMove[1] + fMove[2];
                var aPosition = fMove[3] + fMove[4];
                instanceBoard = JSON.parse(JSON.stringify(board));
                delete instanceBoard[bPosition];
                instanceBoard[aPosition] = figureType;
                if (kingUnderCheck(instanceBoard)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    findComputerMove: function (board) {
        debugger;
        instanceBoard = JSON.parse(JSON.stringify(board));
        var move = findComputerMove(instanceBoard);
        return move;
    },

    kingUnderCheck: function (board) {
        instanceBoard = JSON.parse(JSON.stringify(board));
        return kingUnderCheck(instanceBoard);
    }
}

function findComputerMove(board) {
    var sideColor = "b";
    if (whiteMove) {
        sideColor = "w";
    }
    var bestValue = -Infinity;
    var bestMove = null;
    for (var position in board) {
        if (board[position][0] == sideColor) {
            var possibleMoves = getPossibleMoves(board, position);
            for (var i = 0; i < possibleMoves.length; i++){
                var fMove = possibleMoves[i];
                var moveValue = estimateMove(fMove);
                if (moveValue >= bestValue) {
                    bestMove = moveValue;
                    bestMove = fMove;
                }
            }
        }
    }
    return bestMove;
}

function estimateMove(move) {
    return 100;
}

function getPossibleMoves(board, position) {
    var figureType = board[position];
    return getPossibleMovesByFigureType(board, position, figureType);
}

function getPossibleMovesByFigureType(board, position, ft) {
    var moves = [];
    for (var i = 1; i <= 8; i++) {
        for (var j = 0; j < 8; j++) {
            var afterPosition = boardLetters[j] + i;
            var fullMove = ft[1] + position + afterPosition;
            if (board[afterPosition] != undefined) {
                fullMove += "x" + board[afterPosition];
            }
            if (ChessUtils.moveIsPossible(fullMove, true)){
                moves.push(fullMove);
            }
        }
    }
    return moves;
}

function isCheckMate(board){

}

function  kingUnderCheck(board) {
    var kingColor = "b";
    if (whiteMove) {kingColor = "w";}
    var kingPosition = findKing(board, kingColor + "k");
    whiteMove = !whiteMove;
    for (var position in board) {
        if (board[position][0] != kingColor) {
            var fMove = board[position][1] + position + kingPosition + "x" + kingColor;
            if (ChessUtils.moveIsPossible(fMove, false)){
                whiteMove = !whiteMove;
                return true;
            }
        }
    }
    whiteMove = !whiteMove;
    return false;
}

function findKing(board, value) {
    for (var position in board) {
        if (board[position] == value) {
            return position;
        }
    }
}

function noFiguresOnWay(stype, bPosition, aPosition) {
    var currentPosition = bPosition;
    var i = 0;
    var moveWidth = digLet[aPosition[0]] - digLet[bPosition[0]];
    var moveLength = parseInt(aPosition[1]) - parseInt(bPosition[1]);
    var type = "";
    switch(stype) {
        case "p":
            if (whiteMove) {
                if (bPosition[1] == 2 && aPosition[1] == 4){
                    currentPosition = incrementPosition(bPosition, "ru");
                    if (instanceBoard[currentPosition] != undefined) {
                        return false;
                    }
                }
            }
            else {
                if (bPosition[1] == 7 && aPosition[1] == 5){
                    currentPosition = incrementPosition(bPosition, "rd");
                    if (instanceBoard[currentPosition] != undefined) {
                        return false;
                    }
                }
            }
            return true;
        case "b":
            type = "b";
            if (moveLength > 0) {
                type += "u";
            }
            else {
                type += "d";
            }
            if (moveWidth > 0) {
                type += "r"
            }
            else {
                type += "l"
            }
            currentPosition = incrementPosition(currentPosition, type);
            while (currentPosition != aPosition && i < 8) {
                if (instanceBoard[currentPosition] != undefined) {
                    return false;
                }
                i++;
                currentPosition = incrementPosition(currentPosition, type);
            }
            return true;
        case "r":
            if (moveLength > 0) {
                type = "ru";
            }
            if (moveLength < 0) {
                type = "rd";
            }
            if (moveWidth > 0) {
                type = "rr";
            }
            if (moveWidth < 0) {
                type = "rl";
            }
            currentPosition = incrementPosition(currentPosition, type);
            while (currentPosition != aPosition && i < 8) {
                if (instanceBoard[currentPosition] != undefined) {
                    return false;
                }
                i++;
                currentPosition = incrementPosition(currentPosition, type);
            }
            return true;
        case q:
            if (moveLength == 0) {
                if (moveWidth > 0) {
                    type = "rr";
                }
                else {
                    type = "rl";
                }
            } else if(moveWidth == 0){
                if (moveLength > 0) {
                    type = "ru";
                }
                else {
                    type = "rd";
                }
            }
            else {
                type = "b";
                if (moveLength > 0) {
                    type += "u";
                }
                else {
                    type += "d";
                }
                if (moveWidth > 0) {
                    type += "r"
                }
                else {
                    type += "l"
                }
            }
            currentPosition = incrementPosition(currentPosition, type);
            while (currentPosition != aPosition && i < 8) {
                if (instanceBoard[currentPosition] != undefined) {
                    return false;
                }
                i++;
                currentPosition = incrementPosition(currentPosition, type);
            }
            return true;
        default:
            return true;
    }
}

function incrementPosition(position, type) {
    var newPosition = position;
    switch(type) {
        case "ru":
            newPosition = position[0] + (parseInt(position[1]) + 1);
            return newPosition;
        case "rd":
            newPosition = position[0] + (parseInt(position[1]) - 1);
            return newPosition;
        case "rl":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) - 1)) + position[1];
            return newPosition;
        case "rr":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) + 1)) + position[1];
            return newPosition;
        case "bur":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) + 1)) + (parseInt(position[1]) + 1);
            return newPosition;
        case "bul":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) - 1)) + (parseInt(position[1]) + 1);
            return newPosition;
        case "bdr":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) + 1)) + (parseInt(position[1]) - 1);
            return newPosition;
        case "bdl":
            newPosition = String.fromCharCode((position[0].charCodeAt(0) - 1)) + (parseInt(position[1]) - 1);
            return newPosition;
        default: return newPosition;
    };
}

function movementIsPossible(fMove){
    var figureType = fMove[0];
    var bPosition = fMove[1] + fMove[2];
    var aPosition = fMove[3] + fMove[4];
    var isTaking = fMove[5];
    if (bPosition == aPosition) return false;
    if ((parseInt(bPosition[1]) > 8) || (parseInt(bPosition[1]) < 1)) return false;
    if ((parseInt(aPosition[1]) > 8) || (parseInt(aPosition[1]) < 1)) return false;
    if (aPosition[0].charCodeAt(0) < "a".charCodeAt(0) || aPosition[0].charCodeAt(0) > "h".charCodeAt(0)) return false;
    if (bPosition[0].charCodeAt(0) < "a".charCodeAt(0) || bPosition[0].charCodeAt(0) > "h".charCodeAt(0)) return false;
    if (isTaking){
        if (whiteMove == true && fMove[6] == "w"){
            return false;
        }
        if (whiteMove == false && fMove[6] == "b"){
            return false;
        }
        if (fMove[7] == "k"){
            return false;
        }
    }
    var moveWidth = digLet[aPosition[0]] - digLet[bPosition[0]];
    var moveLength = parseInt(aPosition[1]) - parseInt(bPosition[1]);
    switch(figureType) {
        case "p":
            if (whiteMove) {
                if (isTaking == "x") {
                    if (Math.abs(moveWidth) != 1){
                        return false;
                    }
                    if (moveLength != 1) {
                        return false;
                    }
                }
                else {
                    if (moveWidth != 0) {
                        return false;
                    }
                    if (parseInt(bPosition[1]) == 2){
                        if (moveLength > 2) {
                            return false;
                        }
                        if (moveLength < 1) {
                            return false;
                        }
                        if (!noFiguresOnWay("p", bPosition, aPosition)) {
                            return false;
                        }
                    }
                    else {
                        if (moveLength != 1) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (isTaking == "x") {
                    if (Math.abs(moveWidth) != 1){
                        return false;
                    }
                    if ((-1)*moveLength != 1) {
                        return false;
                    }
                }
                else {
                    if (moveWidth != 0) {
                        return false;
                    }
                    if (parseInt(bPosition[1]) == 7){
                        if ((-1)*moveLength > 2) {
                            return false;
                        }
                        if ((-1)*moveLength < 1) {
                            return false;
                        }
                        if (!noFiguresOnWay("p", bPosition, aPosition)) {
                            return false;
                        }
                    }
                    else {
                        if ((-1)*moveLength != 1) {
                            return false;
                        }
                    }
                }
            }
            return true;
        case "n":
            if (Math.abs(moveWidth) == 1 && Math.abs(moveLength) == 2) {
                return true;
            }
            if (Math.abs(moveWidth) == 2 && Math.abs(moveLength) == 1) {
                return true;
            }
            return false;
        case "b":
            if (Math.abs(moveWidth) == Math.abs(moveLength)) {
                if (noFiguresOnWay("b", bPosition, aPosition)) {
                    return true;
                }
            }
            return false;
        case "r":
            if (moveWidth == 0 || moveLength == 0) {
                if (noFiguresOnWay("r", bPosition, aPosition)) {
                    return true;
                }
            }
            return false;
        case "q":
            if (moveWidth == 0 || moveLength == 0) {
                if (noFiguresOnWay("r", bPosition, aPosition)) {
                    return true;
                }
            }
            if (Math.abs(moveWidth) == Math.abs(moveLength)) {
                if (noFiguresOnWay("b", bPosition, aPosition)) {
                    return true;
                }
            }
            return false;
        case "k":
            if (Math.abs(moveWidth) > 1 || Math.abs(moveLength) > 1) {
                return false;
            }
            if (Math.abs(moveWidth) == 1 || Math.abs(moveLength) == 1){
                return true;
            }
            return false;
        default:
            return true;
    }
    return false;
}

var digLet = {
    "a" : 1,
    "b" : 2,
    "c" : 3,
    "d" : 4,
    "e" : 5,
    "f" : 6,
    "g" : 7,
    "h" : 8
}