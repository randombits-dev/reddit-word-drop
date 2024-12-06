import { MouseEventHandler, useState } from 'react';
import { Coord } from '../models.ts';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';
import { $score } from '../stores/game.ts';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
const CONTAINER_SIZE = 400;
export const LetterGridSvg = ({ initLetters }: { initLetters: string[][] }) => {


  const [letters, setLetters] = useState<string[][]>(initLetters);

  // const letterSize = useMemo(() => {
  //   return Math.floor(CONTAINER_SIZE / initLetters.length - initLetters.length * );
  // }, []);

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


  const totalPadding = CONTAINER_SIZE / 5;
  const letterPadding = totalPadding / (initLetters.length - 1);
  const letterSize = CONTAINER_SIZE / initLetters.length - totalPadding / (initLetters.length);
  const letterSpacing = letterSize + letterPadding;
  const textLocation = letterSize / 2;
  return (
    <svg height={CONTAINER_SIZE} width={CONTAINER_SIZE} onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}>
      {/*<rect x={0} y={0} width={410} height={410} fill="black" />*/}
      {
        currentSelection.length > 0 &&
        <path
          d={`M ${currentSelection.map(({ x, y }) =>
            `${x * letterSpacing + textLocation} ${y * letterSpacing + textLocation}`).join(' L ')}`}
          stroke="#666" strokeWidth="10" fill="none" />
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
                    <rect x={colNum * letterSpacing}
                          y={rowNum * letterSpacing}
                          width={letterSize} height={letterSize}
                          fill={boxColor(colNum, rowNum)} rx={15}
                          onMouseOver={(e) => onMouseOver(e, colNum, rowNum)} />
                    <text fontFamily="monospace" fontSize={24}
                          x={colNum * letterSpacing + textLocation}
                          y={rowNum * letterSpacing + textLocation} fill="white"
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
