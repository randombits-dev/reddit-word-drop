import { sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';
import { useStore } from '@nanostores/react';
import { $page, $score, $sound } from '../stores/game.ts';
import { useDevvitListener } from '../hooks/useDevvitListener.tsx';
import { useEffect, useState } from 'react';
import { generateBoard } from '../util/boardGen.ts';

export const HomePage = () => {
  const score = useStore($score);
  const sound = useStore($sound);
  const [letters, setLetters] = useState<string[][] | null>(generateBoard(7));

  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
    // $score.listen((score) => {
    //   sendToDevvit({ type: 'SUBMIT_SCORE', payload: { score } });
    // });
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

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[url('/reddit-1.png')]`}>

      {/*<h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Animals</h1>*/}

      {letters && <><LetterGridSvg initLetters={letters} />
        {/*<p className="relative z-20 mb-2 mt-1 text-center text-neutral-300">*/}
        {/*  Find as many words as you can, then click "Submit Score"*/}
        {/*</p>*/}
        <div className="flex mt-4 items-end gap-5">
          <div className="flex items-baseline gap-2 text-neutral-300">
            <div className="text-4xl">{score}</div>
            <div className="text-md">{score === 1 ? 'point' : 'points'}</div>
          </div>
          <button onClick={submitScore}
                  className="relative z-20 text-white bg-slate-950 px-5 py-2 rounded-xl">
            Submit Score
          </button>
          <button onClick={() => $page.set('help')}
                  className="relative z-20 text-white bg-slate-950 px-5 py-2 rounded-xl">
            Help
          </button>
          <button onClick={() => $sound.set(!$sound.get())}
                  className="relative z-20 text-white bg-slate-950 px-5 py-2 rounded-xl">
            {sound ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </>}
    </div>
  );
};
