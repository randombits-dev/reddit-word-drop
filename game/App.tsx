import { HelpPage } from './pages/HelpPage.tsx';
import { HomePage } from './pages/HomePage';
import { useStore } from '@nanostores/react';
import { $page } from './stores/game.ts';
import { ResultsPage } from './pages/ResultsPage.tsx';
import { useDevvitListener } from './hooks/useDevvitListener.tsx';
import { useEffect } from 'react';
import { sendToDevvit } from './utils.ts';

// const getPage = (page: Page) => {
//   switch (page) {
//     case 'home':
//       return <HomePage />;
//     case 'help':
//       return <HelpPage />;
//     case 'results':
//       return <ResultsPage />;
//     default:
//       throw new Error(`Unknown page: ${page satisfies never}`);
//   }
// };

export const App = () => {
  const page = useStore($page);

  const initData = useDevvitListener('INIT_RESPONSE');

  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      $page.set('results');
    }
  }, [initData]);


  if (initData) {
    return <div>
      {page === 'results' ? <ResultsPage results={initData} /> :
        <HomePage letters={initData.board!} />}
      {page === 'help' && <HelpPage />}
    </div>;
  } else {
    return <div>Loading...</div>;
  }

};
