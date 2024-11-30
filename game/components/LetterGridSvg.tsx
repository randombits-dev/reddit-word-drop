import { useState } from 'react';
import { generateBoard } from '../util/boardGen.ts';
import { Coord } from '../models.ts';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
export const LetterGridSvg = () => {

  const [letters, setLetters] = useState(generateBoard());
  const [currentSelection, setCurrentSelection] = useState<Coord[]>([]);
  const [falling, setFalling] = useState<Coord[]>([]);

  const onMouseDown = (e) => {
    e.preventDefault();
    mouseDown = true;
    setCurrentSelection([lastOver]);
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    mouseDown = false;


    if (isWordInDict(letters, currentSelection)) {
      const [newLetters, newFalling] = dropBoxes(letters, currentSelection);
      setLetters(newLetters);
      setFalling(newFalling);
    }

    setCurrentSelection([]);
  };

  const onMouseOver = (e, x, y) => {
    e.preventDefault();
    lastOver = { x, y };
    if (!mouseDown) return;

    console.log(adjustSelection(currentSelection, { x, y }));
    setCurrentSelection(adjustSelection(currentSelection, { x, y }));
  };

  const boxColor = (i, j) => {
    // if (solved[i][j]) return '#034d03';
    if (currentSelection.some(({ x, y }) => x === i && y === j)) return '#444';
    // if (filled[i][j]) return '#444';
    return '#222';
  };

  return (
    <svg height={410} width={410} onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}>
      {/*<rect x={0} y={0} width={410} height={410} fill="black" />*/}
      {
        currentSelection.length > 0 &&
        <path
          d={`M ${currentSelection.map(({ x, y }) => `${x * 50 + 30} ${y * 50 + 30}`).join(' L ')}`}
          stroke="#666" strokeWidth="5" fill="none" />
      }
      {
        letters.map((row, i) => (
          <>
            {
              row.map((letter, j) => (
                <>{letter &&
                  <g className={falling.some(({ x, y }) => x === i && y === j) ? 'fall-1' : ''}>
                    <rect x={10 + i * 50} y={10 + j * 50} width={40} height={40}
                          fill={boxColor(i, j)} rx={10} onMouseOver={(e) => onMouseOver(e, i, j)} />
                    <text x={i * 50 + 30} y={j * 50 + 30} fill="white" textAnchor="middle"
                          alignmentBaseline="middle">{letter}</text>
                  </g>} </>
              ))
            }
          </>
        ))
      }

    </svg>
  );
};
