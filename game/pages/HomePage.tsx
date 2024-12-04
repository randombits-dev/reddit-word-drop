import { sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';
import { useStore } from '@nanostores/react';
import { $score } from '../stores/game.ts';
import { useDevvitListener } from '../hooks/useDevvitListener.tsx';
import { useEffect, useState } from 'react';


export const HomePage = () => {
  const score = useStore($score);
  const [letters, setLetters] = useState<string[][] | null>(null);

  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);
  useEffect(() => {
    if (initData) {
      console.log('initData', initData);
      const board = JSON.parse(initData.board);
      setLetters(board);
    }
  }, [initData]);

  const submitScore = () => {
    sendToDevvit({
      type: 'ADD_RESULTS',
      payload: {
        score: $score.get(),
      },
    });
  };

  console.log('home page');

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">

      {/*<h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Animals</h1>*/}
      <p className="relative z-20 mb-4 mt-2 text-center text-neutral-300">
        {score} points
      </p>
      {letters && <><LetterGridSvg initLetters={letters} />
        <button onClick={submitScore}
                className="relative z-20 mt-4 text-white bg-slate-950 px-3 py-1 rounded-md">
          I'm stuck, Submit Score
        </button>
      </>}
    </div>
  );
};
