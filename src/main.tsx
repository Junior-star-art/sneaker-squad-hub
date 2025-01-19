import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

console.log('Initializing application...');

const queryClient = new QueryClient();

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Mounting React application...');

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

console.log('Application mounted successfully');