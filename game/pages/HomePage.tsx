import { ComponentProps, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { calcBoxesToHighlight, checkWord, cn } from '../utils';
import { wordSearchArray, WS1 } from '../util/wordSearchGenerate.ts';

const [lettersStr, ...words] = WS1;
const letters = wordSearchArray(lettersStr);

const getInitState = () => {
  return letters.map(r => {
    return r.map(() => false);
  });
};

let mouseDown = false;
let lastOver: [number, number] = [-1, -1];
let lastGood: [number, number] = [-1, -1];
let startBox: [number, number] = [-1, -1];
let dir = 0;
const LetterGrid = () => {
  const [filled, setFilled] = useState(getInitState());
  const [solved, setSolved] = useState(getInitState());

  const onMouseDown = (e) => {
    e.preventDefault();
    mouseDown = true;
    startBox = [...lastOver];
    filled[lastOver[0]][lastOver[1]] = !filled[lastOver[0]][lastOver[1]];
    setFilled({ ...filled });
    // onMouseOver(e, lastOver[0], lastOver[1]);
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    mouseDown = false;

    const filledBoxes = calcBoxesToHighlight(startBox, lastOver);
    if (checkWord(letters, filledBoxes, words)) {
      const newSolved = { ...solved };
      filledBoxes.forEach(([x, y]) => {
        newSolved[x][y] = true;
      });
      setSolved(newSolved);
    }
    setFilled(getInitState());
  };

  const onMouseOver = (e, i, j) => {
    e.preventDefault();
    lastOver = [i, j];
    if (!mouseDown) return;

    const filledBoxes = calcBoxesToHighlight(startBox, [i, j]);
    const newFilled = getInitState();
    filledBoxes.forEach(([x, y]) => {
      newFilled[x][y] = true;
    });
    setFilled(newFilled);

    // const newDir = calcDir(startBox, [i, j]);
    // console.log('dir', newDir);

    // if (dir === 0 || newDir === dir) {
    //   filled[i][j] = !filled[i][j];
    //   setFilled({ ...filled });
    //   dir = newDir;
    //   lastGood = [i, j];
    // } else if (Math.abs(newDir - dir) === 4) {
    //   filled[lastGood[0]][lastGood[1]] = !filled[lastGood[0]][lastGood[1]];
    //   setFilled({ ...filled });
    // }
  };

  const boxColor = (i, j) => {
    if (solved[i][j]) return '#0f0';
    if (filled[i][j]) return '#444';
    return '#111';
  };

  return (
    <div className="text-white" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {
        letters.map((row, i) => (
          <div className="flex">
            {
              row.map((letter, j) => (
                <div className="w-[30px] h-[30px] border text-center"
                     style={{ backgroundColor: boxColor(i, j) }}

                     onMouseOver={(e) => onMouseOver(e, i, j)}>
                  {letter}
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export const HomePage = ({ postId }: { postId: string }) => {
  const setPage = useSetPage();

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">

      <h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Welcome to Devvit</h1>
      <p className="relative z-20 mb-4 mt-2 text-center text-neutral-300">
        Let's build something awesome!
      </p>
      <LetterGrid />
    </div>
  );
};

const MagicButton = ({ children, ...props }: ComponentProps<'button'>) => {
  return (
    <button
      className={cn(
        'relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
        props.className,
      )}
      {...props}
    >
      <span
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};
