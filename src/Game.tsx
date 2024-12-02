import { WEBVIEW_ID } from './constants.js';
import { Devvit } from '@devvit/public-api';

export const Game: Devvit.BlockComponent<{
  onMessage: Devvit.Blocks.OnWebViewEventHandler
}> = ({ onMessage }) => {
  return <webview
    id={WEBVIEW_ID}
    url="index.html"
    width={'100%'}
    height={'100%'}
    onMessage={onMessage}
  />;
};
