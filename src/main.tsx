import { Devvit, useAsync } from '@devvit/public-api';
import { Preview } from './Preview.js';
import { Game } from './Game.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { sendMessageToWebview } from './utils/utils.js';
import { generateBoard } from '../game/util/boardGen.js';

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
  title: 'Create new Word Drop',
  acceptLabel: 'Create',
}, async (event, context) => {
  const value = event.values['grid-size'][0];
  const board = JSON.stringify(generateBoard(parseInt(value)));

  const { reddit, ui } = context;
  const subreddit = await reddit.getCurrentSubreddit();
  const date = new Date().toLocaleDateString();
  const post = await reddit.submitPost({
    // Title of the post. You'll want to update!
    title: `Word Drop - ${date} - ${value}x${value}`,
    subredditName: subreddit.name,
    preview: <Preview />,

  });
  await context.redis.hSet('board_' + post.id, { board });

  // ui.showToast({ text: 'Created post!' });
  ui.navigateTo(post.url);
});

Devvit.addMenuItem({
  // Please update as you work on your idea!
  label: 'Create new Word Drop',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    context.ui.showForm(puzzleForm);
  },
});

Devvit.addSchedulerJob({
  name: 'word-drop-auto',
  onRun: async (event, context) => {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const date = new Date().toLocaleDateString();
    const post = await context.reddit.submitPost({
      // Title of the post. You'll want to update!
      title: `Word Drop - ${date} - 5x5`,
      subredditName: subreddit.name,
      preview: <Preview />,
    });
    void context.redis.hSet('board_' + post.id, { board: JSON.stringify(generateBoard(5)) });
  },
});

Devvit.addMenuItem({
  label: 'Toggle daily Word Drop creation',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    let jobId = await context.redis.get('jobId');
    if (jobId) {
      await context.scheduler.cancelJob(jobId);
      context.redis.del('jobId');
      context.ui.showToast('Disabled creating daily puzzles');
    } else {
      jobId = await context.scheduler.runJob({
        name: 'word-drop-auto',
        cron: '0 3 * * *',
      });
      context.redis.set('jobId', jobId);
      context.ui.showToast('Enabled creating daily puzzles');
    }
  },
});

Devvit.addMenuItem({
  label: 'clear',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const jobId = (await context.redis.get('jobId')) || '0';
    await context.scheduler.cancelJob(jobId);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Webview Post Post',
  height: 'tall',
  render: (ctx) => {
    const {
      data: username,
    } = useAsync(async () => {
      const user = await ctx.reddit.getCurrentUser();
      return user?.username ?? null;
    });

    const {
      data: results,
    } = useAsync(async () => {
      return Promise.all([
        ctx.redis.hGet('board_' + ctx.postId, 'board'),
        ctx.redis.zCard(ctx.postId!),
        ctx.redis.zRange(ctx.postId!, -5, -1, { by: 'rank', reverse: true }),
        ctx.redis.zScore(ctx.postId!, username!),
        ctx.redis.zRank(ctx.postId!, username!),
      ]).then(([board, num, top, score, rank]) => {
        return {
          top,
          score,
          num,
          rank: num - rank!,
          username,
          board: JSON.parse(board!),
        };
      });
    }, {
      depends: username,
    });


    const onMessage = async (event: any) => {
      const data = event as unknown as WebviewToBlockMessage;
      switch (data.type) {
        case 'INIT':
          sendMessageToWebview(ctx, {
            type: 'INIT_RESPONSE',
            payload: results,
          });
          break;
        case 'ADD_RESULTS':
          const redis = ctx.redis;
          const newScore = data.payload.score;

          await redis.zAdd(ctx.postId!, { member: username!, score: newScore });

          const [num, rank, top] = await Promise.all([
            redis.zCard(ctx.postId!),
            redis.zRank(ctx.postId!, username!),
            redis.zRange(ctx.postId!, -5, -1, { by: 'rank', reverse: true }),
          ]);
          // const myRank = await redis.zRank(ctx.postId!, username!);
          // const top = await ctx.redis.zRange(ctx.postId!, -5, -1, { by: 'rank', reverse: true });

          // console.log({
          //   ...results,
          //   score: newScore,
          //   num,
          //   rank: num - rank!,
          //   top,
          // });

          sendMessageToWebview(ctx, {
            type: 'INIT_RESPONSE',
            payload: {
              ...results,
              score: newScore,
              num,
              rank: num - rank!,
              top,
            },
          });

          break;

        default:
          console.error('Unknown message type', data satisfies never);
          break;
      }
    };


    return (
      <vstack height="100%" width="100%" alignment="center middle">
        <Game onMessage={onMessage} />
      </vstack>
    );
  },
});

export default Devvit;
