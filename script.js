/*
░░░░░░░░░ TIC-TAC-TOE ARRAY
░ 0│1│2 ░ each board is an array with 9 values, array[0] is upper left corner
░ ─┼─┼─ ░  
░ 3│4│5 ░  G L O S S A R Y
░ ─┼─┼─ ░   empty   :  0
░ 6│7│8 ░   human   : -1
░░░░░░░░░   computer: +1

example: human plays upper left corner, so array[0] = -1
Human moves are negative since code is written from AI's perspective
The tokens (O/X) are calculated depending on the `humanIsX` variable
*/

var squares = document.getElementsByClassName("board-square");
var board = [
	0, 0, 0,
	0, 0, 0,
	0, 0, 0,
];

// takes a board array and returns an array of valid moves (emptyPositions.length is num of valid moves)
// returns false if there are no valid moves
function validMoves(boardArr) {
	if (checkBoard(boardArr) !== false) {
		//game already ended
		return false;
	}
	var emptyPositions = [];
	if (checkBoard(boardArr) === false) {
		boardArr.map(function(value, index) {
			if (value === 0) { emptyPositions.push(index); }
		});
	}
	return emptyPositions;
}

// checkBoard takes a board array
// checkBoard returns:
//     -1: human won
//     +1: AI won
//      0: game was tied
//  false: game hasn't finished 
function checkBoard(board) {
	function match(a, b, c) {
		if (a === 0) { return false; }
		return (a === b) && (a === c);
	}
	// horizontal
	if (match(board[0], board[1], board[2])) { return board[0]; }
	if (match(board[3], board[4], board[5])) { return board[3]; }
	if (match(board[6], board[7], board[8])) { return board[6]; }
	// vertical
	if (match(board[0], board[3], board[6])) { return board[0]; }
	if (match(board[1], board[4], board[7])) { return board[1]; }
	if (match(board[2], board[5], board[8])) { return board[2]; }
	// diagonal
	if (match(board[0], board[4], board[8])) { return board[0]; }
	if (match(board[2], board[4], board[6])) { return board[2]; }
	
	var isTie = board.indexOf(0) === -1;
	if (isTie) { return 0; }
	else { return false; }
}

//returns a NEW board array with the updated position
function boardMove(parentBoard, pos, val) {
	var newBoard = parentBoard.slice();
	if (newBoard[pos] !== 0) {
		console.log('attempted to move to a used position');
		throw 'invalid move position'
	}
	newBoard[pos] = val;
	return newBoard;
}
// turnOf is either +1 (AI) or -1 (human)
// returns point value of board fed to it, should return between -10 and +10
// feed possible moves/boards to this function to get the best move
// similar to `checkBoard`, but also returns values for "in progress" games
function superCheckBoard(board, turnOf, iterationValue) {
	var iterationValue = iterationValue || 10;
	var boardCheck = checkBoard(board);
	if (boardCheck !== false) {
		//game finished
		return iterationValue * boardCheck;
	} else {
		var possibleMoves = validMoves(board); // aray with square numbers that re empty
		var possibleBoards = possibleMoves.map(function(move) {
			return boardMove(board, move, turnOf);
		});
		var possibleValues = possibleBoards.map(function(subBoard) {
			return superCheckBoard(subBoard, turnOf * (-1), iterationValue - 1);
		});
		return possibleValues.reduce(function(a, b) {
			if(turnOf == +1) return Math.max(a, b);
			if(turnOf == -1) return Math.min(a, b);
		});
	}
}

// getWinningPositions is should only be called once game is done, to highlight the winning squares
// basically the same as the checkBoard, but instead returns an array of positions that won 
function getWinningPositions() {
	function match(a, b, c) {
		if (a === 0) { return false; }
		return (a === b) && (a === c);
	}
	// horizontal
	if (match(board[0], board[1], board[2])) { return [0, 1, 2]; }
	if (match(board[3], board[4], board[5])) { return [3, 4, 5]; }
	if (match(board[6], board[7], board[8])) { return [6, 7, 8]; }
	// vertical
	if (match(board[0], board[3], board[6])) { return [0, 3, 6]; }
	if (match(board[1], board[4], board[7])) { return [1, 4, 7]; }
	if (match(board[2], board[5], board[8])) { return [2, 5, 8]; }
	// diagonal
	if (match(board[0], board[4], board[8])) { return [0, 4, 8]; }
	if (match(board[2], board[4], board[6])) { return [2, 4, 6]; }
	
	var isTie = board.indexOf(0) === -1;
	if (isTie) { return [0, 1, 2, 3, 4, 5, 6, 7, 8]; }
	else { return false; }
}

// returns a num, 0-8, representing the best square the AI should move to
function bestAIMove(board) {
	//if AI goes first, chose randomly to avoid CPU acrobatics (algorithm would choose randomly anyways)
	if (board.indexOf(-1) == -1 && board.indexOf(+1) == -1) {
		return Math.floor(Math.random() * board.length);
	}
	var emptySquares = validMoves(board);
	var bestMoves = [];
	var bestValue = -Infinity;
	for (var i = 0; i < emptySquares.length; i++) {
		var boardAfterMove = boardMove(board, emptySquares[i], +1);
		var moveValue = superCheckBoard(boardAfterMove, -1);
		console.log(emptySquares[i], moveValue);
		if (bestValue < moveValue) {
			bestMoves = [];
			bestValue = moveValue;
		}
		if (bestValue == moveValue) {
			bestMoves.push(emptySquares[i])
		}
	}
	return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

var humanIsX = true;
function refreshBoard() {
	function token(i) { // I need to rewrite this for clarity
		// empty: 0, human: -1, AI: +1
		// given the (0/-1/+1) value 'i', return ' ', 'X' or 'O' token depending on if 'humanIsX'
		if (i === 0) { return ' '; }
		if (humanIsX) {
			if (i === -1) { return 'X'; }
			else return 'O';
		}
		else {
			if (i === +1) { return 'X'; }
			else return 'O'
		}
	}
	board.map(function(val, index) {
		squares[index].innerHTML = token(val);
	});
}

var isCurrentlyTurnOfHuman = true;
function press(key) {
	if (key === 'reset') {
		board = [
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
		];
		refreshBoard();
	}
	if (key === 'O') {
		press('reset');
		isCurrentlyTurnOfHuman = humanIsX = false;
		AIMove();
	}
	if (key === 'X') {
		press('reset')
		isCurrentlyTurnOfHuman = humanIsX = true;
	}
	if (0 <= key && key <= 8) {
		;
	}
}

// function uses 'isCurrentlyTurnOfHuman' var to play idfferent token depending on who's turn it is
function playSquare(position) {
	var legalMoves = validMoves(board);
	console.log(legalMoves);
	if (legalMoves && legalMoves.indexOf(position) > -1) {
		var token = isCurrentlyTurnOfHuman ? (-1) : (+1);
		board[position] = token;
		refreshBoard();
	}
}

var originalSquareColor;
// flashes winning positions and resets the game
function restartGame() {
	var squaresToFlash = getWinningPositions();
	if (squaresToFlash === false) { return; }
	var flashColor = (squaresToFlash.length === 3)? 'green' : 'gray';
	var flashDuration = 1000;
	var squares = document.getElementsByClassName('board-square');
	//originalSquareColor = function(){ return squares[0].style.backgroundColor; }() // assume squares share the same colorDepth
	
	squaresToFlash.map(function(i) {
		squares[i].style.backgroundColor = flashColor;
		setTimeout(function() {
			squares[i].style.backgroundColor = originalSquareColor;
			if(humanIsX) {
				press('X');
			}
			else {
				press('O');
			}
		}, flashDuration);
	});
}

// AIMove and humanMove are their own function as a way to force them to take turns
function AIMove() {
	// !! add some sort of one to two second delay to make AI feel lifelike
	var timeDelay = 50 + 450 * Math.random();
	console.log("AI WILL SOON PLAY if false", isCurrentlyTurnOfHuman);
	setTimeout(function() {
		if (isCurrentlyTurnOfHuman) { return; } // for some reason the function is triplicated after the first round of human playing as 'O', this line fixes the issue caused (AI playing 3 times)
		var position = bestAIMove(board);
		console.log("AI plays", position);
		playSquare(position);
		isCurrentlyTurnOfHuman = true;
		restartGame()
	}, timeDelay);
}
function humanMove(position) {
	return function() {
		if (isCurrentlyTurnOfHuman && board[position] == 0) {
			console.log("ishumanturn???", isCurrentlyTurnOfHuman);
			playSquare(position);
			console.log("YOU PRESSED", position, "!");
			isCurrentlyTurnOfHuman = false;
			AIMove();
			restartGame(); //only runs if game finished
		}
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById("start-o").onclick = function() {
		press('O');
	}
	document.getElementById("start-x").onclick = function() {
		press('X');
	}
	
	for(var i = 0; i < squares.length; i++) {
		squares[i].onclick = humanMove(i);
		console.log(squares[i])
	}
	originalSquareColor = squares[0].style.backgroundColor;
	refreshBoard();
});

