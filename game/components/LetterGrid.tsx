import { useState } from 'react';
import { isWordInDict } from '../util/dictionary.ts';
import { adjustSelection, dropBoxes } from '../util/boxUtil.ts';
import { generateBoard } from '../util/boardGen.ts';
import { Coord } from '../models.ts';

let mouseDown = false;
let lastOver: Coord = { x: -1, y: -1 };
export const LetterGrid = () => {
  const [letters, setLetters] = useState(generateBoard());
  const [currentSelection, setCurrentSelection] = useState<Coord[]>([]);

  const onMouseDown = (e) => {
    e.preventDefault();
    mouseDown = true;
    setCurrentSelection([lastOver]);
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    mouseDown = false;


    if (isWordInDict(letters, currentSelection)) {
      setLetters(dropBoxes(letters, currentSelection));
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
    <div className="text-neutral-200 grid grid-cols-8 max-w-[500px] gap-3" onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}>
      {
        letters.map((row, i) => (
          <>
            {
              row.map((letter, j) => (
                <div
                  className="w-[30px] h-[30px] rounded-lg text-center flex items-center justify-center"
                  style={{ backgroundColor: boxColor(i, j) }}

                  onMouseOver={(e) => onMouseOver(e, i, j)}>
                  <div className="text-center">{letter}</div>

                </div>
              ))
            }
          </>
        ))
      }
    </div>
  );
};