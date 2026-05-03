from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def checkWin(board):
    wincons = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]
    for con in wincons:
        if (board[con[0]] == board[con[1]] and board[con[0]] == board[con[2]] and board[con[0]] != " "):
            return board[con[0]]
        
    for i in range(9):
        if board[i] == " ":
            break
    else:
        return "draw"
    
    return 0

def getBoardValue(board):
    res = checkWin(board)
    count = 0
    for m in board:
        if m != " ":
            count += 1
    if (res):
        if (res == "X"):
            return 13 - count
        elif (res == "O"):
            return count - 13
        else:
            return 0

def getChildStates(board, player):
    children = []
    for i in range(9):
        boardCpy = list(board)
        if board[i] == " ":
            boardCpy[i] = player
            children.append((boardCpy, i))
    return children

def miniMax(board, player):
    if checkWin(board):
        return getBoardValue(board), 0
        
    if player == "X":
        bestValue = -999
        bestMove = 0

        for child, move in getChildStates(board, "X"):
            value, m = miniMax(child, "O")
            if (value > bestValue):
                bestValue = value
                bestMove = move

        return bestValue, bestMove
    
    if player == "O":
        bestValue = 999
        bestMove = []
        for child, move in getChildStates(board, "O"):
            value, m = miniMax(child, "X")
            if (value < bestValue):
                bestValue = value
                bestMove = move
        return bestValue, bestMove

@app.route('/')
def home():
    return "Crazy Tic Tac Toe AI"


@app.route('/ai/nextmove', methods=['POST'])
def ai_move():
    data = request.get_json()
    board = data['board']
    player = data['player']

    v, move = miniMax(board, player)

    return jsonify({
        "move": f"{move}"
    })


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)