import { sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';
import { useStore } from '@nanostores/react';
import { $score } from '../stores/game.ts';
import { useDevvitListener } from '../hooks/useDevvitListener.tsx';
import { useEffect, useState } from 'react';
import { generateBoard } from '../util/boardGen.ts';


export const HomePage = () => {
  const score = useStore($score);
  const [letters, setLetters] = useState<string[][] | null>(generateBoard(7));

  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
    $score.listen((score) => {
      sendToDevvit({ type: 'SUBMIT_SCORE', payload: { score } });
    });
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
    <>

      {/*<h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Animals</h1>*/}
      {/*<p className="relative z-20 mb-4 mt-2 text-center text-neutral-300">*/}
      {/*  Find any many words as you can, then click "Submit Score"*/}
      {/*</p>*/}
      {letters && <><LetterGridSvg initLetters={letters} />
        {/*<div className="flex items-center mt-4 ">*/}
        {/*  <div className="text-neutral-300">{score} points</div>*/}
        {/*  <button onClick={submitScore}*/}
        {/*          className="relative z-20 text-white bg-slate-950 px-3 py-1 rounded-md">*/}
        {/*    Submit Score*/}
        {/*  </button>*/}
        {/*</div>*/}
      </>}
    </>
  );
};
