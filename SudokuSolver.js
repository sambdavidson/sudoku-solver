/**
 * Created by Sam on 10/10/2016.
 */

var squareSize = 3;
var numLilSquares = 3;

function readInputBoard() {
    var outputBoard = new Array(9);
    var rows = document.getElementsByClassName('Row');
    for(var i = 0; i < rows.length; i++) {
        var row = [];
        for(var j = 0; j < rows[i].children.length; j++) {
            var num = parseInt(rows[i].children[j].value);
            if(!isNaN(num) && num >= 1 && num <= 9)
                row.push(num);
            else
                row.push(0);
        }
        outputBoard[i] = row;
    }
    return outputBoard;
}
function writeToInputBoard(board) {
    var rows = document.getElementsByClassName('Row');
    for(var i = 0; i < rows.length; i++) {
        for(var j = 0; j < rows[i].children.length; j++) {
            rows[i].children[j].value = board[i][j];
        }
    }
}

function solve(board) {
    board = readInputBoard();

    var t0 = performance.now();
    var solution = solveBoard(board);
    var t1 = performance.now();
    console.log("Call to solveBoard took " + (t1 - t0) + " milliseconds.");

    writeToInputBoard(solution);

}

function solveBoard(board) {

    var firstPossibilities = null;
    var possibilitiesBoard = [];
    var possibilities;
    for(var i = 0; i < board.length; i++) {
        var rowPossibilities = [];
        for(var j = 0; j < board[i].length; j++) {
            possibilities = getPossibilities(board,i,j);
            if(possibilities == null) {
                return null;
            }
            if(possibilities.length > 0 && firstPossibilities == null) {
                firstPossibilities = [i,j];
            }
            rowPossibilities.push(possibilities)

        }
        possibilitiesBoard.push(rowPossibilities)
    }

    if(firstPossibilities == null) {
        if(validateSolution(board))
            return board;
        else
            return null;
    }

    var ourBoard = cloneBoard(board);
    var wereGuaranteedNumbers = false;

    for(i = 0; i < ourBoard.length; i++) {
        for(j = 0; j < ourBoard[i].length; j++) {
            if(possibilitiesBoard[i][j].length == 1) {
                ourBoard[i][j] = possibilitiesBoard[i][j][0];
                wereGuaranteedNumbers = true;
            }
        }
    }

    if(wereGuaranteedNumbers) {
        return solveBoard(ourBoard);
    } else {
        possibilities = possibilitiesBoard[firstPossibilities[0]][firstPossibilities[1]];
        for(i = 0; i < possibilities.length; i++) {
            //console.log("running pos", firstPossibilities[0],firstPossibilities[1], possibilities[i]);
            ourBoard[firstPossibilities[0]][firstPossibilities[1]] = possibilities[i];
            var solution = solveBoard(ourBoard);
            if(solution != null) {
                return solution;
            }
        }
    }

    return null;
}

function cloneBoard(board) {
    var outboard = [];

    for(var i = 0; i < board.length; i++) {
        var row = [];
        for(var j = 0; j < board[i].length; j++)
        {
            row.push(board[i][j]);
        }
        outboard.push(row);
    }

    return outboard;
}

function getPossibilities(board,i,j) {
    if(board[i][j] != 0) {
        return [];
    }

    var possibilities = [1,2,3,4,5,6,7,8,9];

    var numsSeen = getNumsInRow(board,i).concat(getNumsInCol(board,j)).concat(getNumsInSquare(board,i,j));
    for(var x = 0; x < numsSeen.length; x++) {
        possibilities[numsSeen[x]-1] = null;
    }

    var outbound = [];
    for(x = 0; x < possibilities.length; x++) {
        if(possibilities[x] != null) {
            outbound.push(possibilities[x]);
        }
    }

    if(outbound.length == 0) {
        return null;
    }
    return outbound;

}

function getNumsInRow(board, i) {
    seen = [];

    for(var j = 0; j < board[i].length; j++) {
        number =  board[i][j];
        if(number >= 1 && number <= 9) {
            seen.push(number);
        }
    }
    return seen;
}
function getNumsInCol(board,j) {
    //Verify each column
    seen = [];

    for(var i = 0; i < board.length; i++) {

        number = board[i][j];

        if(number >= 1 && number <= 9) {
            seen.push(number);
        }
    }

    return seen;
}

function getNumsInSquare(board,i,j) {
    //WhichSquareIsIt

    var squareI = Math.floor(i / numLilSquares);
    var squareJ = Math.floor(j / numLilSquares);

    var startX = squareSize * squareI;
    var startY = squareSize * squareJ;

    seen = [];

    for(var k = startX; k < startX + squareSize; k++) {
        for(var l = startY; l < startY + squareSize; l++) {
            number = board[k][l];
            if(number >= 1 && number <= 9) {
                seen.push(number);
            }
        }
    }

    return seen;

}

function validateBoardDimensions(board) {

    var isValid = true;
    if(board.length != 9) {
        alert("board.length != 9");
        isValid = false;
    }
    for(var i = 0; i < board.length; i++ ) {
        if(board[i].length != 9) {
            alert("board["+i+"].length != 9");
            isValid = false;
        }
    }
    return isValid
}

function validateSolution(board) {

    if(!validateBoardDimensions(board)) {
        return false;
    }

    var seen, number, i, j;

    //Verify each row
    for(i  = 0; i < board.length; i++) {

        seen = new Array(9);

        for(j = 0; j < board[i].length; j++) {
            number =  board[i][j];
            if(number >= 1 && number <= 9) {
                if(seen[number-1]) {
                    return false;
                } else {
                    seen[number-1] = true;
                }
            } else {
                return false;
            }
        }
    }

    console.log("row test passed");
    //Verify each column
    for(i  = 0; i < board[0].length; i++) {

        seen = new Array(9);

        for(j = 0; j < board.length; j++) {

            number =  board[j][i];

            if(number >= 1 && number <= 9) {
                if(seen[number-1]) {
                    return false;
                } else {
                    seen[number-1] = true;
                }
            } else {
                return false;
            }
        }
    }
    console.log("column test passed");
    //Verify each lil' square

    for(i = 0; i < numLilSquares; i++) {
        for(j = 0; j < numLilSquares; j++) {
            var startX = squareSize * i;
            var startY = squareSize * j;
            seen = new Array(9);
            for(var k = startX; k < startX + squareSize; k++) {
                for(var l = startY; l < startY + squareSize; l++) {
                    number = board[k][l];
                    if(number >= 1 && number <= 9) {
                        if(seen[number-1]) {
                            return false;
                        } else {
                            seen[number-1] = true;
                        }
                    } else {
                        return false;
                    }
                }
            }
        }
    }
    console.log("lil' sub-square test passed");
    return true;
}

function boardString(boardin) {
    board = [];

    for(var i = 0; i < boardin.length; i++) {
        board = board.concat(boardin[i]);
    }

    var out = '';
    for(i = 0; i < board.length; i++) {
        if(i % 9 === 0) {
            out += '\n';
        }
        if(i % (9 * 3) === 0 && i > 0) {
            out += Array(9*3).join('-') + '\n';
        }
        if(i % 3 === 0) {
            if(i % 9 !== 0) {
                out += '|';
            }
            out += ' ';
        }
        out += board[i] + ' ';
    }
    return out;
}

