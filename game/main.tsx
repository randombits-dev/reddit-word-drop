// @ts-expect-error
import './index.css';
import { createRoot } from 'react-dom/client';
import { HomePage } from './pages/HomePage.tsx';

createRoot(document.getElementById('root')!).render(
  <HomePage />,
);
