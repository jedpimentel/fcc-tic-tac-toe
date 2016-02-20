Unbeatable tic-tac-toe, created as part of the freecodecamp.com curriculum.
problem statement: http://www.freecodecamp.com/challenges/build-a-tic-tac-toe-game

I've based my approach on the minimax algorithm described here http://neverstopbuilding.com/minimax


DIAGRAM OF THE 9 SQUARE TIC-TAC-TOE BOARD 
░░░░░░░░░ array[0] is upper left corner, array[8] is bottom right
░ 0│1│2 ░ 
░ ─┼─┼─ ░ moves are saved in the value of array[i], where:
░ 3│4│5 ░   empty   :  0   (all squares are initialized to zero)
░ ─┼─┼─ ░   human   : -1   (human bad)
░ 6│7│8 ░   computer: +1   (computer good)
░░░░░░░░░ 

Each board state has a point total, which represents how favorable that state is for the AI
A "game finished" board state is worth +10 (AI won), -10 (human won), or 0 (tie).
The value of an "in progress board" depends on who's turn it is. (recursion warning!)
	-human's turn: out of possible new board states, the one with most negative value, plus one
	-AI's turn: out of possible new board states, the one with most positive value, minus one
	
The AI takes its best possible move, and assumes the human also make a perfect move.
Humans that don't play perfectly can loose.

Jose Eduardo Pimentel
/jedpimentel