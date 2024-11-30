import { cn, sendToDevvit } from '../utils';
import { LetterGridSvg } from '../components/LetterGridSvg.tsx';


export const HomePage = () => {
  const submitScore = () => {
    sendToDevvit({
      type: 'ADD_RESULTS',
      payload: 'this is a test comment',
    });
  };

  console.log('home page');

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">

      <h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Animals</h1>
      <p className="relative z-20 mb-4 mt-2 text-center text-neutral-300">
        11 Words Remaining
      </p>
      <LetterGridSvg />
      {/*<button onClick={submitScore}*/}
      {/*        className="relative z-20 mt-4 text-white bg-slate-950 px-3 py-1 rounded-md">*/}
      {/*  Submit Score*/}
      {/*</button>*/}
    </div>
  );
};
