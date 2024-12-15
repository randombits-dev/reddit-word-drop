import { sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';
import { useStore } from '@nanostores/react';
import { $page, $score } from '../stores/game.ts';
import { MainButton } from '../components/MainButton.tsx';

interface Props {
  letters: string[][];
}

export const HomePage = ({ letters }: Props) => {
  const score = useStore($score);

  const submitScore = () => {
    sendToDevvit({
      type: 'ADD_RESULTS',
      payload: {
        score: $score.get(),
      },
    });
    // $results.set({
    //   avg: 8.23,
    //   num: 110,
    //   best: 19,
    //   userBest: 11,
    //   score: 11,
    //   top: [
    //     { user: 'user1', score: 19 },
    //     { user: 'user2', score: 18 },
    //     { user: 'user3', score: 17 },
    //     { user: 'user4', score: 16 },
    //     { user: 'user5', score: 15 },
    //   ],
    // });
    // $page.set('results');
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-['Comic_Helvetic']`}>

      {letters && <><LetterGridSvg initLetters={letters} />

        <div className="flex w-[400px] mt-4 items-end gap-5">
          <div className="flex flex-grow items-baseline gap-2 text-neutral-900">
            <div className="text-4xl">{score}</div>
            <div className="text-md">{score === 1 ? 'point' : 'points'}</div>
          </div>
          <MainButton onClick={submitScore}>
            Submit Score
          </MainButton>
          <MainButton onClick={() => $page.set('help')}>
            Help
          </MainButton>
        </div>
      </>}
    </div>
  );
};
