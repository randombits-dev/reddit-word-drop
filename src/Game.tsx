import { WEBVIEW_ID } from './constants.js';
import { Devvit, useState } from '@devvit/public-api';
import { WebviewToBlockMessage } from '../game/shared.js';

export const Game: Devvit.BlockComponent<{
  onMessage: Devvit.Blocks.OnWebViewEventHandler
}> = ({ onMessage }, context) => {

  const [score, setScore] = useState(0);

  return <vstack height="100%" width="100%" grow>
    <text>Find any many words as you can, then click "Submit Score"</text>
    <webview
      grow
      id={WEBVIEW_ID}
      url="index.html"
      width="400px"
      height="400px"
      onMessage={async (event) => {
        const data = event as unknown as WebviewToBlockMessage;
        switch (data.type) {
          case 'SUBMIT_SCORE':
            setScore(data.payload.score);
            break;
          default:
            onMessage(event);
        }
      }}
    />
    <hstack>
      <text>Score: {score}</text>
      <button onPress={() => onMessage({ type: 'ADD_RESULTS', payload: { score } })}>Submit Score
      </button>
    </hstack>
  </vstack>;
};
