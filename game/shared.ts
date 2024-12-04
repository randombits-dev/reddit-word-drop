export type Page =
  | 'home'
  | 'pokemon';

export type WebviewToBlockMessage = { type: 'INIT' } | {
  type: 'ADD_RESULTS';
  payload: any;
};

export type BlocksToWebviewMessage = {
  type: 'INIT_RESPONSE';
  payload: {
    board: string
  };
};

export type DevvitMessage = {
  type: 'devvit-message';
  data: { message: BlocksToWebviewMessage };
};
