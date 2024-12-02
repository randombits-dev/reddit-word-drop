import { MouseEventHandler, useState } from 'react';
import { generateBoard } from '../util/boardGen.ts';
import { Coord } from '../models.ts';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';
import { $score } from '../stores/game.ts';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
export const LetterGridSvg = () => {

  const [letters, setLetters] = useState(generateBoard());
  const [currentSelection, setCurrentSelection] = useState<Coord[]>([]);
  const [falling, setFalling] = useState<Coord[]>([]);

  const onMouseDown: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault();
    mouseDown = true;
    setCurrentSelection([lastOver]);
  };

  const onMouseUp: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault();
    mouseDown = false;


    if (isWordInDict(letters, currentSelection)) {
      const [newLetters, newFalling] = dropBoxes(letters, currentSelection);
      setLetters(newLetters);
      setFalling(newFalling);
      const score = currentSelection.length - 2;
      console.log('Score:', score);
      $score.set($score.get() + score);
    }

    setCurrentSelection([]);
  };

  const onMouseOver = (e: Event, x: number, y: number) => {
    e.preventDefault();
    lastOver = { x, y };
    if (!mouseDown) return;
    setCurrentSelection(adjustSelection(currentSelection, { x, y }));
  };

  const boxColor = (colNum: number, rowNum: number) => {
    // if (solved[i][j]) return '#034d03';
    if (currentSelection.some(({ x, y }) => x === colNum && y === rowNum)) return '#444';
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
        letters.map((col, colNum) => (
          <>
            {
              col.map((letter, rowNum) => (
                <>{letter &&
                  <g className={falling.some(({
                                                x,
                                                y,
                                              }) => x === colNum && y === rowNum) ? 'fall-1' : ''}>
                    <rect x={10 + colNum * 50} y={10 + rowNum * 50} width={40} height={40}
                          fill={boxColor(colNum, rowNum)} rx={10}
                          onMouseOver={(e) => onMouseOver(e, colNum, rowNum)} />
                    <text x={colNum * 50 + 30} y={rowNum * 50 + 30} fill="white" textAnchor="middle"
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
