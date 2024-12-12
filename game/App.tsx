import { Page } from './shared';
import { HelpPage } from './pages/HelpPage.tsx';
import { HomePage } from './pages/HomePage';
import { useStore } from '@nanostores/react';
import { $page } from './stores/game.ts';
import { ResultsPage } from './pages/ResultsPage.tsx';

const getPage = (page: Page) => {
  switch (page) {
    case 'home':
      return <HomePage />;
    case 'help':
      return <HelpPage />;
    case 'results':
      return <ResultsPage />;
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  const page = useStore($page);

  return <div>
    <HomePage />;
    {page === 'help' && <HelpPage />}
  </div>;
};
