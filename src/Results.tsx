import { Devvit } from '@devvit/public-api';

export const Results: Devvit.BlockComponent<{ results: any, onLaunch: () => void }> = ({
                                                                                         results,
                                                                                         onLaunch,
                                                                                       }) => {

  const printHighlight = () => {
    if (results.score >= results.best) {
      return <text size="xlarge">New High Score!</text>;
    } else if (results.score >= results.avg) {
      return <text size="xlarge">You beat the average!</text>;
    } else if (results.score) {
      return <text size="xlarge">Good Job!</text>;
    }
    return <text size="xlarge"></text>;
  };

  const Stat = ({ title, value }: any) => {
    return <vstack alignment="center" width="110px" backgroundColor="#333" padding="medium"
                   cornerRadius="small">
      <text weight="bold" size="medium" style="metadata">{title}</text>
      <text size="xxlarge">{value}</text>
    </vstack>;
  };

  const Card = ({ title, children }: any) => {
    return <vstack gap="small" backgroundColor="#0039AB" cornerRadius="small" padding="small">
      <text size="large" alignment="center" weight="bold">{title}</text>
      <hstack>
        {children}
      </hstack>
    </vstack>;
  };

  return <vstack gap="large">
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
    <button size="large"
            onPress={() => {
              onLaunch();
            }}
    >
      Try Again
    </button>
  </vstack>
    ;
};
