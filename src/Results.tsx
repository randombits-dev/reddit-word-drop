import { Devvit } from '@devvit/public-api';

export const Results: Devvit.BlockComponent<{ results: any, onLaunch: () => void }> = ({
                                                                                         results,
                                                                                         onLaunch,
                                                                                       }) => {
  return <vstack>
    {results.score &&
      <vstack alignment="center">
        <text size="medium" style="metadata">Last Score</text>
        <text size="xxlarge">{results?.score}</text>
      </vstack>}
    <text>My best: {results?.userBest}</text>
    <text>Average: {results?.avg}</text>
    <text>Global Best: {results?.best}</text>
    <button size="large"
            onPress={() => {
              onLaunch();
            }}
    >
      Try Again
    </button>
  </vstack>;
};
