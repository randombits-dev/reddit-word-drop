import { $page } from '../stores/game.ts';
import { MainButton } from '../components/MainButton.tsx';

export const HelpPage = () => {

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-100 gap-3 text-left">
      <div className="text-lg max-w-[500px]">
        <p className="text-lg font-bold">How to Play</p>
        <p className="py-2">1. Make valid words out of the letter tiles, by connecting letters
          vertically,
          horizontally,
          or diagonally.</p>
        <p className="py-2">2. The goal is to score as many points as you can.</p>
        <p className="py-2">3. Longer words are worth more points. The score for completing a word
          is (LENGTH - 2).
          For
          example, a 3 letter word is worth 1
          point, a 4 letter word is worth 2 points, etc.</p>
        <p className="py-2">4. Once you can't make any more words, click Submit Score to see how you
          ranked against
          other
          players.</p>
      </div>
      <MainButton onClick={() => $page.set('home')}>
        Back to Game
      </MainButton>
    </div>
  );
};
