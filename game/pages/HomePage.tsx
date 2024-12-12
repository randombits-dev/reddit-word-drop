import { sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';
import { useStore } from '@nanostores/react';
import { $page, $results, $score } from '../stores/game.ts';
import { useDevvitListener } from '../hooks/useDevvitListener.tsx';
import { useEffect, useState } from 'react';
import { generateBoard } from '../util/boardGen.ts';

export const HomePage = () => {
  const score = useStore($score);
  // const sound = useStore($sound);
  const [letters, setLetters] = useState<string[][] | null>(generateBoard(6));

  const initData = useDevvitListener('INIT_RESPONSE');
  const scoreResponse = useDevvitListener('SCORE_RESPONSE');
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

  useEffect(() => {
    if (scoreResponse) {
      $page.set('results');
    }
  }, [scoreResponse]);

  const submitScore = () => {
    // sendToDevvit({
    //   type: 'ADD_RESULTS',
    //   payload: {
    //     score: $score.get(),
    //   },
    // });
    $results.set({
      avg: 8.23,
      num: 110,
      best: 19,
      userBest: 11,
      score: 11,
      top: [
        { user: 'user1', score: 19 },
        { user: 'user2', score: 18 },
        { user: 'user3', score: 17 },
        { user: 'user4', score: 16 },
        { user: 'user5', score: 15 },
      ],
    });
    $page.set('results');
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden`}>

      {/*<h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Animals</h1>*/}

      {letters && <><LetterGridSvg initLetters={letters} />
        {/*<p className="relative z-20 mb-2 mt-1 text-center text-neutral-300">*/}
        {/*  Find as many words as you can, then click "Submit Score"*/}
        {/*</p>*/}
        <div className="flex w-[400px] mt-4 items-end gap-5">
          <div className="flex flex-grow items-baseline gap-2 text-neutral-300">
            <div className="text-4xl">{score}</div>
            <div className="text-md">{score === 1 ? 'point' : 'points'}</div>
          </div>
          <button onClick={submitScore}
                  className="relative z-20 text-black border-2 font-bold border-neutral-900 font-['Comic_Helvetic'] px-3 py-2">
            Submit Score
          </button>
          <button onClick={() => $page.set('help')}
                  className="relative z-20 text-black border-2 font-bold border-neutral-900 font-['Comic_Helvetic'] px-3 py-2">
            Help
          </button>
          {/*<button onClick={() => $sound.set(!$sound.get())}*/}
          {/*        className="relative z-20 text-white bg-slate-950 px-3 py-2 rounded-xl">*/}
          {/*  {sound ? <SpeakerOn /> : <SpeakerOff />}*/}
          {/*</button>*/}
        </div>
      </>}
    </div>
  );
};
