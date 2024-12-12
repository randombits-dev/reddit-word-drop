import { $results } from '../stores/game.ts';

export const ResultsPage = ({ results }) => {
  // const [results, setResults] = useState<any>({});

  const printHighlight = () => {
    if (results.score >= results.best) {
      return <text className="">New High Score!</text>;
    } else if (results.score >= results.avg) {
      return <text className="">You beat the average!</text>;
    } else if (results.score) {
      return <text className="">Good Job!</text>;
    }
    return <text className=""></text>;
  };

  const newGame = () => {
    $results.set(null);
  };

  const Stat = ({ title, value }: any) => {
    return <div className="">
      <div className="">{title}</div>
      <div className="text-xl">{value}</div>
    </div>;
  };

  const Card = ({ title, children }: any) => {
    return <div>
      <text className="">{title}</text>
      <div className="flex">
        {children}
      </div>
    </div>;
  };

  const BoardCard = ({ item: { i, user, score } }) => {
    return <div
      className="flex items-center gap-3 border-2 border-neutral-700 rounded-lg my-1 px-3">
      <div>{i + 1}.</div>
      <div className="flex-grow min-w-40">{user}</div>
      <div className="text-xl">{score}</div>
    </div>;
  };

  const Board = ({ items }) => {
    return <div className="font-['Comic Helvetic']">
      {items.map(((item, i) => {
        return <BoardCard key={i} item={{ i, ...item }} />;
      }))
      }
    </div>;
  };

  return <div
    className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-['Comic_Helvetic']`}>
    {/*{*/}
    {/*  printHighlight()*/}
    {/*}*/}
    {/*{results.userBest &&*/}
    {/*  <Card title="My stats">*/}
    {/*    {results.score && <Stat title="Your Score" value={results.score} />}*/}
    {/*    <Stat title="Your Best" value={results.userBest} />*/}
    {/*  </Card>*/}
    {/*}*/}
    <div className="font-bold text-lg">My Rank</div>
    <BoardCard item={{ i: -1, user: 'You', score: results.score }} />
    <div className="font-bold text-lg mt-5">Leaderboard</div>
    <Board items={results.top} />

    {/*<div className="font-bold text-lg">Stats</div>*/}

    <div className="flex gap-10 text-center mt-5">
      <Stat title="Average" value={results.avg} />
      <Stat title="Players" value={results.num} />
    </div>
    <button
      onClick={newGame} className="mt-5 border-2 border-neutral-700 px-4 py-2 rounded-lg"
    >
      Try Again
    </button>
  </div>;
};
