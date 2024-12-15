import { $page } from '../stores/game.ts';
import { MainButton } from '../components/MainButton.tsx';

export const ResultsPage = ({ results }) => {

  const newGame = () => {
    $page.set('home');
  };

  const BoardCard = ({ item: { i, member, score } }) => {
    return <div
      className="flex items-center gap-3 border-2 border-neutral-700 rounded-lg my-1 px-3 pt-1">
      <div className="w-12">#{i}</div>
      <div className="w-40 flex-grow">{member}</div>
      <div className="w-8 text-right text-xl">{score}</div>
    </div>;
  };

  const Board = ({ items }) => {
    return <div className="font-['Comic Helvetic']">
      {items.map(((item, i) => {
        return <BoardCard key={i} item={{ i: i + 1, ...item }} />;
      }))
      }
    </div>;
  };

  return <div
    className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-['Comic_Helvetic']`}>

    {
      results.score && <>
        <div className="font-bold text-lg">My Rank</div>
        <BoardCard
          item={{ i: results.rank, member: results.username, score: results.score }} />
      </>
    }

    {
      results.top.length > 0 && <>
        <div className="font-bold text-lg mt-5">Leaderboard</div>
        {/*<div>Top 5 of {results.num} players</div>*/}
        <Board items={results.top} />
      </>
    }


    {/*<div className="font-bold text-lg">Stats</div>*/}

    {/*<div className="flex gap-10 text-center mt-5">*/}
    {/*  <Stat title="Average Score" value={results.avg} />*/}
    {/*  <Stat title="Total Players" value={results.num} />*/}
    {/*</div>*/}
    <div className="mt-5">
      <MainButton
        onClick={newGame}
      >
        {results.score ? 'Play Again' : 'Start Game'}
      </MainButton>
    </div>
  </div>;
};
