import { Devvit } from '@devvit/public-api';

export const Initial: Devvit.BlockComponent<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        <button size="large"
                onPress={() => {
                  onLaunch();
                }}
        >
          Launch
        </button>
      </vstack>
    </zstack>
  );
};
