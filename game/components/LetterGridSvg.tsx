import { MouseEventHandler, useState } from 'react';
import { Coord } from '../models.ts';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';
import { $score } from '../stores/game.ts';
import chalkBorder from '../img/chalk-border-2.png';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
const CONTAINER_SIZE = 400;
export const LetterGridSvg = ({ initLetters }: { initLetters: string[][] }) => {
  const [letters, setLetters] = useState<string[][]>(initLetters);

  const [currentSelection, setCurrentSelection] = useState<Coord[]>([]);
  const [falling, setFalling] = useState<Coord[]>([]);
  const [status, setStatus] = useState(0);

  const onMouseDown: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault();
    if (e.buttons !== 1) return;
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

  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault();
    if (!mouseDown || e.buttons === 1) return;
    mouseDown = false;
    setCurrentSelection([]);
    setStatus(0);
  };

  const boxColor = (colNum: number, rowNum: number) => {
    // if (solved[i][j]) return '#034d03';
    if (currentSelection.some(({ x, y }) => x === colNum && y === rowNum)) {
      if (status === 2) return '#B8646B';
      if (status === 1) return '#57B866';
      return '#ccc';
    }
    // if (filled[i][j]) return '#444';
    return 'transparent';
  };

  let lineColor = '#ccc';
  if (status === 2) {
    lineColor = '#B8646B';
  } else if (status === 1) {
    lineColor = '#57B866';
  }


  const totalPaddingBox = CONTAINER_SIZE / 5;
  const letterPaddingBox = totalPaddingBox / (initLetters.length - 1);
  const letterSizeBox = CONTAINER_SIZE / initLetters.length - totalPaddingBox / (initLetters.length);
  const letterSpacingBox = letterSizeBox + letterPaddingBox;
  // const textLocation = letterSizeBox / 2;

  const totalPaddingRect = CONTAINER_SIZE / 10;
  const letterPaddingRect = totalPaddingRect / (initLetters.length - 1);
  const letterSizeRect = CONTAINER_SIZE / initLetters.length - totalPaddingRect / (initLetters.length);
  const letterSpacingRect = letterSizeRect + letterPaddingRect;
  const textLocation = letterSizeRect / 2;

  return (
    <div className="" onMouseEnter={onMouseEnter}>
      <svg height={CONTAINER_SIZE} width={CONTAINER_SIZE} onMouseDown={onMouseDown}
           onMouseUp={onMouseUp} fontFamily="Comic Helvetic" fontSize={28} fontWeight="600">


        {
          currentSelection.length > 0 &&
          <path
            d={`M ${currentSelection.map(({ x, y }) =>
              `${x * letterSpacingRect + textLocation} ${y * letterSpacingRect + textLocation}`).join(' L ')}`}
            stroke={lineColor} strokeWidth="10" fill="none" />
        }


        {
          letters.map((col, colNum) => (
            <>
              {
                col.map((letter, rowNum) => (
                  <>{letter &&
                    <g className={falling.some(({ x, y }) =>
                      x === colNum && y === rowNum) ? 'fall-1' : ''}
                    >

                      <rect x={colNum * letterSpacingRect}
                            y={rowNum * letterSpacingRect}

                            width={letterSizeRect} height={letterSizeRect}
                            fill={boxColor(colNum, rowNum)} rx={4}
                      />
                      <image href={chalkBorder} x={colNum * letterSpacingRect}
                             y={rowNum * letterSpacingRect} width={letterSizeRect}
                             height={letterSizeRect} />
                      <text
                        x={colNum * letterSpacingRect + textLocation}
                        y={rowNum * letterSpacingRect + textLocation + 2} fill="black"
                        textAnchor="middle"
                        alignmentBaseline="central">{letter}</text>
                      <rect x={colNum * letterSpacingBox}
                            y={rowNum * letterSpacingBox}

                            width={letterSizeBox} height={letterSizeBox}
                            rx={15}
                            fill="transparent"
                            onMouseOver={(e) => onMouseOver(e, colNum, rowNum)}
                      />
                    </g>} </>
                ))
              }
            </>
          ))
        }

      </svg>
    </div>
  );
};
