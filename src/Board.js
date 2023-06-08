import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - numrows: number of rows of board
 * - numcols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ numrows = 3, numcols = 3, chanceLightStartsOn = 0.25}) {
  const [board, setBoard] = useState(createBoard);

  /** create a board numrows high/numcols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({length: numrows}).map(
      row => Array.from({length: numcols}).map(
        cell => Math.random() < chanceLightStartsOn
      )
    );
  }

  let tblBoard = [];

  for(let y = 0; y < numrows; y++){
    let row = [];
    for(let x = 0; x < numcols; x++){
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={evt => flipCellsAround(coord)}
          />
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  function hasWon() {
    return board.every(row => row.every(cell => cell === false));
  }

  function flipCell(y, x, boardCopy) {
    // if this coord is actually in the board,flip it

    if (x >= 0 && x < numcols && y >= 0 && y < numrows) {
      boardCopy[y][x] = !boardCopy[y][x];
    }
  };

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);


      const boardCopy = oldBoard.map(row => [...row]);

      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell( y + 1, x, boardCopy);

      return boardCopy;
    });
  }

  if(hasWon()){
    return <div>You Won!</div>;
  }

  return(
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
