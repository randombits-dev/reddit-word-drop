import { Devvit, useState } from '@devvit/public-api';
import { DEVVIT_SETTINGS_KEYS, WEBVIEW_ID } from './constants.js';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { Preview } from './components/Preview.js';

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
  // redis: true,
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
    const [launched, setLaunched] = useState(false);

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}
            onMessage={async (event) => {
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
                  void context.reddit.submitComment({
                    id: context.postId!,
                    text: data.payload,
                  });
                  break;

                default:
                  console.error('Unknown message type', data satisfies never);
                  break;
              }
            }}
          />
        ) : (
          <button
            onPress={() => {
              setLaunched(true);
            }}
          >
            Launch
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
