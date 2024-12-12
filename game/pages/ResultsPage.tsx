import { useState } from 'react';

export const ResultsPage = () => {
  const [results, setResults] = useState<any>({});

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

  };

  const Stat = ({ title, value }: any) => {
    return <div className="">
      <text className="">{title}</text>
      <text className="text-xl">{value}</text>
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

  return <div>
    {
      printHighlight()
    }
    {results.userBest &&
      <Card title="My stats">
        {results.score && <Stat title="Your Score" value={results.score} />}
        <Stat title="Your Best" value={results.userBest} />
      </Card>
    }
    <Card title="Global">
      <Stat title="Global Average" value={results.avg} />
      <Stat title="Global Best" value={results.best} />
    </Card>
    <button
      onClick={newGame}
    >
      Try Again
    </button>
  </div>;
};
