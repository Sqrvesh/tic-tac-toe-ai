import { useEffect, useState } from 'react';
import './App.css';
function App() {

  const [board, setBoard] = useState([" ", " ", " ", " ", " ", " ", " ", " ", " "]);
  const [currPlayer, setCurrPlayer] = useState("X");
  const [result, setResult] = useState(null);
  const [player, setPlayer] = useState("X");
  const [ai, setAi] = useState("O");
  const [moveFirst, setMoveFirst] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [isWinningComb, setIsWinningComb] = useState([false, false, false, false, false, false, false, false, false])
  
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
        if (board[a] == board[b] && board[a] == board[c] && board[a] != " ") {
          let winningCombCpy = [...isWinningComb];
          winningCombCpy[a] = true;
          winningCombCpy[b] = true;
          winningCombCpy[c] = true;
          setIsWinningComb(winningCombCpy);
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
      setResult("Match DRAW!!");
    } else if (res != 0) {
      setResult("Match won by " + res);
    }

  }, [board]);

  useEffect(() => {
    if (currPlayer == ai) {
      async function getAImove() {
        setIsLoading(true);
        const response = await fetch("https://tic-tac-toe-backend-i07w.onrender.com/ai/nextmove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            board: board,
            player: ai
          })
        });

        const data = await response.json();
        setIsLoading(false);
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

  function togglePlayerSym() {
    if (player == "X") {
      setPlayer("O");
      setCurrPlayer("O");
      setAi("X");
    } else {
      setPlayer("X");
      setAi("O");
    }
  }

  function toggleMoveFirst() {
    if (moveFirst) {
      setMoveFirst(false);
      setCurrPlayer(ai);
    } else {
      setMoveFirst(true);
      setCurrPlayer(player);
    }
  }
  
  return (
    <div className='app'>
      {isloading &&
        <div className='loading-container'>
          <div className='loading'>Loading...</div>
        </div>
      }

      <div className='settings-container'>
        <div className='result'>{result || "TIC TAC TOE"}</div>
        <button onClick={togglePlayerSym} className='settings-button'>Play as: {player}</button>
        <button onClick={toggleMoveFirst} className='settings-button'>{moveFirst ? "You move first" : "You move second"}</button>
      </div>

      <div className='board-grid'>
        <div className='cell b-right b-down eee' style={{backgroundColor: isWinningComb[0] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(0)}}>{board[0]}</div>
        <div className='cell b-left b-right b-down' style={{backgroundColor: isWinningComb[1] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(1)}}>{board[1]}</div>
        <div className='cell b-left b-down' style={{backgroundColor: isWinningComb[2] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(2)}}>{board[2]}</div>
        <div className='cell b-up b-right b-down' style={{backgroundColor: isWinningComb[3] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(3)}}>{board[3]}</div>
        <div className='cell b-left b-right b-up b-down' style={{backgroundColor: isWinningComb[4] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(4)}}>{board[4]}</div>
        <div className='cell b-up b-left b-down' style={{backgroundColor: isWinningComb[5] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(5)}}>{board[5]}</div>
        <div className='cell b-up b-right' style={{backgroundColor: isWinningComb[6] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(6)}}>{board[6]}</div>
        <div className='cell b-left b-up b-right' style={{backgroundColor: isWinningComb[7] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(7)}}>{board[7]}</div>
        <div className='cell b-left b-up' style={{backgroundColor: isWinningComb[8] ? 'rgb(98, 253, 98)' : 'white'}} onClick={() => {makeMove(8)}}>{board[8]}</div>
      </div>
    </div>
  )
}

export default App
