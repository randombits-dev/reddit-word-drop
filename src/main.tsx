import { Devvit, useState } from '@devvit/public-api';
import { Preview } from './Preview.js';
import { Initial } from './Initial.js';
import { Game } from './Game.js';
import { Results } from './Results.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { sendMessageToWebview } from './utils/utils.js';
import { generateBoard } from '../game/util/boardGen.js';

// Devvit.addSettings([
//   {
//     name: DEVVIT_SETTINGS_KEYS.GRID_SIZE,
//     label: 'Grid Size',
//     type: 'select',
//     options: [
//       { label: '4x4', value: '4' },
//       { label: '6x6', value: '6' },
//       { label: '8x8', value: '8' },
//     ],
//   },
// ]);

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  // realtime: true,
});

const puzzleForm = Devvit.createForm({

  fields: [
    {
      name: 'grid-size',
      label: 'Grid Size',
      type: 'select',
      options: [
        { label: '4x4', value: '4' },
        { label: '5x5', value: '5' },
        { label: '6x6', value: '6' },
        { label: '7x7', value: '7' },
        { label: '8x8', value: '8' },
      ],
      defaultValue: ['5'],
    },
  ],
  title: 'Create a new puzzle',
  acceptLabel: 'Create',
}, async (event, context) => {
  const value = event.values['grid-size'][0];
  const board = JSON.stringify(generateBoard(parseInt(value)));

  const { reddit, ui } = context;
  const subreddit = await reddit.getCurrentSubreddit();
  const post = await reddit.submitPost({
    // Title of the post. You'll want to update!
    title: 'A cool puzzle',
    subredditName: subreddit.name,
    preview: <Preview />,

  });
  await context.redis.hSet('board_' + post.id, { board });
  console.log('set board of ' + post.id + ' to ' + board);

  ui.showToast({ text: 'Created post!' });
  ui.navigateTo(post.url);
});

Devvit.addMenuItem({
  // Please update as you work on your idea!
  label: 'Create new puzzle',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    context.ui.showForm(puzzleForm);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Webview Post Post',
  height: 'tall',
  render: (context) => {
    const [state, setState] = useState(async () => {
      const value = await context.redis.hGet('user_' + context.postId!, context.userId!);
      return value ? 2 : 1;
    });
    const [results, setResults] = useState<any>(async () => {
      return Promise.all([
        context.redis.hGet('board_' + context.postId, 'board'),
        context.redis.hGetAll('avg_' + context.postId!),
        context.redis.hGet('user_' + context.postId!, context.userId!),
      ]).then(([board, { avg, num, best }, userScore]) => {
        console.log('board', board);
        const parsedAvg = avg ? parseFloat(avg) : 0;
        const parsedNum = num ? parseInt(num) : 0;
        const parsedBest = best ? parseInt(best) : 0;
        return {
          avg: parsedAvg,
          num: parsedNum,
          best: parsedBest,
          userBest: userScore,
          board,
        };
      });
    });

    const userId = context.userId;

    const renderContent = (): Devvit.BlockComponent => {
      if (state === 1) {
        return <Game onMessage={async (event) => {
          const data = event as unknown as WebviewToBlockMessage;
          switch (data.type) {
            case 'INIT':
              sendMessageToWebview(context, {
                type: 'INIT_RESPONSE',
                payload: {
                  board: results.board,
                },
              });
              break;
            case 'ADD_RESULTS':


              const redis = context.redis;
              const newScore = data.payload.score;
              const [{ avg, num, best, comment }, userScore] = await Promise.all([
                redis.hGetAll('avg_' + context.postId!),
                redis.hGet('user_' + context.postId!, userId!),
              ]);

              const parsedAvg = avg ? parseFloat(avg) : 0;
              const parsedNum = num ? parseInt(num) : 0;
              const parsedBest = best ? parseInt(best) : 0;
              const newAvg = (parsedAvg * parsedNum + newScore) / (parsedNum + 1);
              const newNum = parsedNum + 1;
              const newBest = parsedBest > newScore ? parsedBest : newScore;
              redis.hSet('avg_' + context.postId!, {
                avg: String(newAvg),
                num: String(newNum),
                best: String(newBest),
              });
              let usersBest = userScore;
              if (!userScore || parseInt(userScore) < newScore) {
                usersBest = newScore;
                redis.hSet('user_' + context.postId!, { [userId!]: String(newScore) });
              }
              setState(2);
              setResults({
                ...results,
                avg: newAvg,
                num: newNum,
                best: newBest,
                userBest: usersBest,
                score: newScore,
              });

              if (comment && newBest > parsedBest) {
                context.reddit.getCommentById(comment).then(c => {
                  void c.edit({
                    text: 'The best score is now ' + newBest,
                  });
                });

              } else {
                context.reddit.submitComment({
                  id: context.postId!,
                  text: 'The best score is now ' + newBest,
                }).then(c => {
                  context.redis.hSet('avg_' + context.postId!, { comment: c.id });
                });
              }


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
