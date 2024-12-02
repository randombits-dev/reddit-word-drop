import { Devvit, useState } from '@devvit/public-api';
import { DEVVIT_SETTINGS_KEYS } from './constants.js';
import { Preview } from './Preview.js';
import { Initial } from './Initial.js';
import { Game } from './Game.js';
import { Results } from './Results.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { sendMessageToWebview } from './utils/utils.js';

Devvit.addSettings([
  // Just here as an example
  {
    name: DEVVIT_SETTINGS_KEYS.SECRET_API_KEY,
    label: 'API Key for secret things',
    type: 'string',
    isSecret: true,
    scope: 'app',
  },
]);

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  // realtime: true,
});

Devvit.addMenuItem({
  // Please update as you work on your idea!
  label: 'Add Webview Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      // Title of the post. You'll want to update!
      title: 'My webview post',
      subredditName: subreddit.name,
      preview: <Preview />,
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post.url);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Webview Post Post',
  height: 'tall',
  render: (context) => {
    const [state, setState] = useState(async () => {
      const value = await context.redis.hGet('user_' + context.postId!, context.userId!);
      return value ? 2 : 0;
    });
    const [results, setResults] = useState<any>(async () => {
      return Promise.all([
        context.redis.hGetAll('avg_' + context.postId!),
        context.redis.hGet('user_' + context.postId!, context.userId!),
      ]).then(([{ avg, num, best }, userScore]) => {
        console.log('received from redis', avg, num, best, userScore);
        const parsedAvg = avg ? parseFloat(avg) : 0;
        const parsedNum = num ? parseInt(num) : 0;
        const parsedBest = best ? parseInt(best) : 0;
        return {
          avg: parsedAvg,
          num: parsedNum,
          best: parsedBest,
          userBest: userScore,
        };
      });
    });

    const userId = context.userId;

    const renderContent = (): Devvit.BlockComponent => {
      if (state === 1) {
        return <Game onMessage={async (event) => {
          console.log('Received message', event);
          const data = event as unknown as WebviewToBlockMessage;
          switch (data.type) {
            case 'INIT':
              sendMessageToWebview(context, {
                type: 'INIT_RESPONSE',
                payload: {
                  postId: context.postId!,
                },
              });
              break;
            case 'ADD_RESULTS':

              context.ui.showToast({ text: `Received message: ${JSON.stringify(data)}` });
              const redis = context.redis;
              const newScore = data.payload.score;
              const [{ avg, num, best }, userScore] = await Promise.all([
                redis.hGetAll('avg_' + context.postId!),
                redis.hGet('user_' + context.postId!, userId!),
              ]);

              console.log('received from redis', avg, num, best, userScore);
              const parsedAvg = avg ? parseFloat(avg) : 0;
              const parsedNum = num ? parseInt(num) : 0;
              const parsedBest = best ? parseInt(best) : 0;
              const newAvg = (parsedAvg * parsedNum + newScore) / (parsedNum + 1);
              const newNum = parsedNum + 1;
              const newBest = parsedBest > newScore ? parsedBest : newScore;
              console.log('new values', newAvg, newNum, newBest);
              redis.hSet('avg_' + context.postId!, {
                avg: String(newAvg),
                num: String(newNum),
                best: String(newBest),
              });
              let usersBest = userScore;
              if (!userScore || parseInt(userScore) < newScore) {
                usersBest = newScore;
                console.log('setting user best', usersBest);
                redis.hSet('user_' + context.postId!, { [userId!]: String(newScore) });
              }
              setState(2);
              setResults({
                avg: newAvg,
                num: newNum,
                best: newBest,
                userBest: usersBest,
                score: newScore,
              });
              break;

            default:
              console.error('Unknown message type', data satisfies never);
              break;
          }
        }} />;
      }
      if (state === 2) {
        return <Results results={results} onLaunch={() => setState(1)} />;
      }
      return <Initial onLaunch={() => setState(1)} />;
    };

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {renderContent()}
      </vstack>
    );
  },
});

export default Devvit;
