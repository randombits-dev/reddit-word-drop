import { Devvit } from '@devvit/public-api';

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        <image
          url="logo.gif"
          description="Loading..."
          height={'100px'}
          width={'100px'}
          imageHeight={'250px'}
          imageWidth={'250px'}
        />
      </vstack>
    </zstack>
  );
};
