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

const automationForm = Devvit.createForm((data) => ({
  fields: [
    {
      name: 'enabled',
      label: 'Enabled',
      type: 'boolean',
      defaultValue: data.enabled || false,
    },
    {
      name: 'timeOfDay',
      label: 'Time of Day',
      type: 'select',
      defaultValue: data.timeOfDay || ['0'],
      options: [
        { label: '00:00', value: '0' },
        { label: '01:00', value: '1' },
        { label: '02:00', value: '2' },
        { label: '03:00', value: '3' },
        { label: '04:00', value: '4' },
        { label: '05:00', value: '5' },
        { label: '06:00', value: '6' },
        { label: '07:00', value: '7' },
        { label: '08:00', value: '8' },
        { label: '09:00', value: '9' },
        { label: '10:00', value: '10' },
        { label: '11:00', value: '11' },
        { label: '12:00', value: '12' },
        { label: '13:00', value: '13' },
        { label: '14:00', value: '14' },
        { label: '15:00', value: '15' },
        { label: '16:00', value: '16' },
        { label: '17:00', value: '17' },
        { label: '18:00', value: '18' },
        { label: '19:00', value: '19' },
        { label: '20:00', value: '20' },
        { label: '21:00', value: '21' },
        { label: '22:00', value: '22' },
        { label: '23:00', value: '23' },
      ],
    },
    {
      name: 'sizes',
      label: 'Grid Sizes',
      helpText: 'You can select more than one size to create multiple puzzles',
      type: 'select',
      defaultValue: data.sizes || ['5'],
      options: [
        { label: '4x4', value: '4' },
        { label: '5x5', value: '5' },
        { label: '6x6', value: '6' },
        { label: '7x7', value: '7' },
        { label: '8x8', value: '8' },
      ],
      multiSelect: true,
    },
  ],
  title: 'Manage Word Drop Automation',
  acceptLabel: 'Save',
}), async (event, context) => {
  console.log('saving ', event.values);
  context.redis.hSet('automation', {
    enabled: String(event.values.enabled),
    timeOfDay: JSON.stringify(event.values.timeOfDay),
    sizes: JSON.stringify(event.values.sizes),
  });
  let jobId = await context.redis.get('jobId');
  if (jobId) {
    await context.scheduler.cancelJob(jobId);
    context.redis.del('jobId');
  }
  if (event.values.enabled) {
    jobId = await context.scheduler.runJob({
      name: 'word-drop-auto',
      cron: `0 ${event.values.timeOfDay[0]} * * *`,
      data: {
        sizes: event.values.sizes,
      },
    });
    context.redis.set('jobId', jobId);
  }
  context.ui.showToast('Saved automation settings');
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
    const sizes = event.data!.sizes as string[];
    const subreddit = await context.reddit.getCurrentSubreddit();
    const date = new Date().toLocaleDateString();
    sizes.forEach(async (size: string) => {
      const post = await context.reddit.submitPost({
        // Title of the post. You'll want to update!
        title: `Word Drop - ${date} - ${size}x${size}`,
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      void context.redis.hSet('board_' + post.id, { board: JSON.stringify(generateBoard(Number(size))) });
    });
  },
});

Devvit.addMenuItem({
  label: 'Manage Word Drop Automation',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    const data = await context.redis.hGetAll('automation');
    console.log('get form data ', data);
    if (data && data.timeOfDay) {
      const parsed = {
        enabled: data.enabled === 'true',
        timeOfDay: JSON.parse(data.timeOfDay),
        sizes: JSON.parse(data.sizes),
      };
      console.log('parsed ', parsed);
      context.ui.showForm(automationForm, parsed);
    } else {
      context.ui.showForm(automationForm);
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
