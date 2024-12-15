import { HelpPage } from './pages/HelpPage.tsx';
import { HomePage } from './pages/HomePage';
import { useStore } from '@nanostores/react';
import { $page, $results } from './stores/game.ts';
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
  const results = useStore($results);
  // const [letters, setLetters] = useState<string[][] | null>(null);
  // const [results, setResults] = useState<string[][] | null>(null);

  const initData = useDevvitListener('INIT_RESPONSE');
  const scoreResponse = useDevvitListener('SCORE_RESPONSE');

  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      // console.log(initData);
      $page.set('results');
      // const data = JSON.parse(initData);
      // setLetters(data.board);
      // $results.set(data);
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
