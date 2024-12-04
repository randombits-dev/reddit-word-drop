import { MouseEventHandler, useMemo, useState } from 'react';
import { Coord } from '../models.ts';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';
import { $score } from '../stores/game.ts';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
const CONTAINER_SIZE = 400;
export const LetterGridSvg = ({ initLetters }: { initLetters: string[][] }) => {


  const [letters, setLetters] = useState<string[][]>(initLetters);

  const letterSize = useMemo(() => {
    return Math.floor(CONTAINER_SIZE / initLetters.length);
  }, []);

  const [currentSelection, setCurrentSelection] = useState<Coord[]>([]);
  const [falling, setFalling] = useState<Coord[]>([]);
  const [status, setStatus] = useState(0);

  const onMouseDown: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault();
    mouseDown = true;
    setCurrentSelection([lastOver]);
  };

  const onMouseUp: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault();
    mouseDown = false;


    if (isWordInDict(letters, currentSelection)) {
      setStatus(1);
      setTimeout(() => {
        const [newLetters, newFalling] = dropBoxes(letters, currentSelection);
        setLetters(newLetters);
        setFalling(newFalling);
        const score = currentSelection.length - 2;
        console.log('Score:', score);
        $score.set($score.get() + score);
        setCurrentSelection([]);
        setStatus(0);
      }, 150);
    } else {
      setStatus(2);
      setTimeout(() => {
        setStatus(0);
        setCurrentSelection([]);
      }, 150);
    }
  };

  const onMouseOver = (e: Event, x: number, y: number) => {
    e.preventDefault();
    lastOver = { x, y };
    if (!mouseDown) return;
    setCurrentSelection(adjustSelection(currentSelection, { x, y }));
  };

  const boxColor = (colNum: number, rowNum: number) => {
    // if (solved[i][j]) return '#034d03';
    if (currentSelection.some(({ x, y }) => x === colNum && y === rowNum)) {
      if (status === 2) return '#b25353';
      if (status === 1) return '#499649';
      return '#444';
    }
    // if (filled[i][j]) return '#444';
    return '#222';
  };

  const textLocation = 5 + letterSize / 2;
  return (
    <svg height={410} width={410} onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}>
      {/*<rect x={0} y={0} width={410} height={410} fill="black" />*/}
      {
        currentSelection.length > 0 &&
        <path
          d={`M ${currentSelection.map(({
                                          x,
                                          y,
                                        }) => `${x * letterSize + textLocation} ${y * letterSize + textLocation}`).join(' L ')}`}
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
                    <rect x={10 + colNum * letterSize} y={10 + rowNum * letterSize}
                          width={letterSize - 10} height={letterSize - 10}
                          fill={boxColor(colNum, rowNum)} rx={15}
                          onMouseOver={(e) => onMouseOver(e, colNum, rowNum)} />
                    <text fontFamily="monospace" fontSize={24}
                          x={colNum * letterSize + textLocation}
                          y={rowNum * letterSize + textLocation} fill="white"
                          textAnchor="middle"
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
