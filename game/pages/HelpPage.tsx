import { $page } from '../stores/game.ts';

export const HelpPage = () => {

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-300 gap-3 text-lg text-left">
      <p>1. Make valid words out of the letter tiles, by connecting letters vertically,
        horizontally,
        or diagonally.</p>
      <p>2. The goal is to score as many points as you can.</p>
      <p>3. Longer words are worth more points. The score for completing a word is (LENGTH - 2). For
        example, a 3 letter word is worth 1
        point, a 4 letter word is worth 2 points, etc</p>
      <p>4. Once you can't make any more words, click Submit Score to see how you ranked against
        other
        players.</p>
      <button onClick={() => $page.set('home')}
              className="relative z-20 text-white bg-slate-950 px-5 py-2 rounded-xl text-base">
        Back to Game
      </button>
    </div>
  );
};
