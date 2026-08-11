import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { injectStructuredData } from './lib/structuredData';
import './styles/index.css';

injectStructuredData();

const container = document.getElementById('root');
if (container === null) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
