export type Page =
  | 'home'
  | 'help'
  | 'results';

export type WebviewToBlockMessage = { type: 'INIT' } | {
  type: 'ADD_RESULTS';
  payload: any;
};

export type BlocksToWebviewMessage = {
  type: 'INIT_RESPONSE';
  payload: any;
} | {
  type: 'SCORE_RESPONSE';
  payload: any;
}

export type DevvitMessage = {
  type: 'devvit-message';
  data: { message: BlocksToWebviewMessage };
};
