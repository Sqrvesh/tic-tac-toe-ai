import { useEffect, useState } from 'react';
import './App.css';
function App() {

  const [board, setBoard] = useState([" ", " ", " ", " ", " ", " ", " ", " ", " "]);
  const [currPlayer, setCurrPlayer] = useState("X");
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    function checkWin() {
      const wincons = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

      for (let i = 0; i < wincons.length; i++) {
        const [a, b, c] = wincons[i];
        if (board[a] == board[b] && board[a] == board[c]) {
          return board[a];
        }
      }

      let draw = 1;
      for (let i = 0; i < 9; i++) {
        if (board[i] == " ") {
          draw = 0;
          break;
        }
      }

      if (draw) return "draw";

      return 0;
    }

    const res = checkWin();
    if (res === "draw") {
      setResult("Match DRAW!!")
    } else if (res != 0) {
      setResult("Match won by " + res);
    }

  }, [board]);

  useEffect(() => {
    if (currPlayer == "O") {
      async function getAImove() {
        const response = await fetch("http://192.168.1.38:5000/ai/nextmove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            board: board,
            player: "O"
          })
        });

        const data = await response.json();
        makeMove(Number(data.move));
      }

      getAImove();
    }
  }, [currPlayer, board]);

  function makeMove(idx) {

    if (board[idx] == " " && result == null) {
      let boardCpy = [...board];
      boardCpy[idx] = currPlayer;
      setBoard(boardCpy);
      togglePlayer();
    }
  }

  function togglePlayer() {
    const nextPlayer = currPlayer === "X" ? "O" : "X";
    setCurrPlayer(nextPlayer);
  }
  
  return (
    <div className='app'>
      <div className='result'>{result}</div>
      <div className='board-grid'>
        <div className='cell b-right b-down' onClick={() => {makeMove(0)}}>{board[0]}</div>
        <div className='cell b-left b-right b-down' onClick={() => {makeMove(1)}}>{board[1]}</div>
        <div className='cell b-left b-down' onClick={() => {makeMove(2)}}>{board[2]}</div>
        <div className='cell b-up b-right b-down' onClick={() => {makeMove(3)}}>{board[3]}</div>
        <div className='cell b-left b-right b-up b-down' onClick={() => {makeMove(4)}}>{board[4]}</div>
        <div className='cell b-up b-left b-down' onClick={() => {makeMove(5)}}>{board[5]}</div>
        <div className='cell b-up b-right' onClick={() => {makeMove(6)}}>{board[6]}</div>
        <div className='cell b-left b-up b-right' onClick={() => {makeMove(7)}}>{board[7]}</div>
        <div className='cell b-left b-up'onClick={() => {makeMove(8)}}>{board[8]}</div>
      </div>
    </div>
  )
}

export default App
