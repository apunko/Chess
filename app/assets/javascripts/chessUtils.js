var ChessUtils = {
    moveIsPossible : function(fMove) {
        var figureType = fMove[0];
        var bPosition = fMove[1] + fMove[2];
        var aPosition = fMove[3] + fMove[4];
        var isTaking = fMove[5];
        var moveWidth = 0;
        var moveLength = 0;
        switch(figureType) {
            case "p":
                moveWidth = digLet[aPosition[0]] - digLet[bPosition[0]];
                moveLength = parseInt(aPosition[1]) - parseInt(bPosition[1]);
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
                        if ((-1)*moveWidth != 1) {
                            return false;
                        }
                    }
                    else {
                        if (moveWidth != 0) {
                            return false;
                        }
                        if (parseInt(bPosition[1]) == 7){
                            if ((-1)*moveWidth > 2) {
                                return false;
                            }
                            if ((-1)*moveWidth < 1) {
                                return false;
                            }
                        }
                        else {
                            if ((-1)*moveWidth != 1) {
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
                    if (noFiguresOnWay("b")) {
                        return true;
                    }
                }
                return false;
            default:
                return true;
        }
        return false;
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
                    if (board[currentPosition] != undefined) {
                        return false;
                    }
                }
            }
            else {
                if (bPosition[1] == 7 && aPosition[1] == 5){
                    if (board[currentPosition] != undefined) {
                        return false;
                    }
                    currentPosition = incrementPosition(bPosition, "rd");
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
            while (currentPosition != aPosition && i < 8) {
                if (board[currentPosition] != undefined) {
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
            while (currentPosition != aPosition && i < 8) {
                if (board[currentPosition] != undefined) {
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
            while (currentPosition != aPosition && i < 8) {
                if (board[currentPosition] != undefined) {
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