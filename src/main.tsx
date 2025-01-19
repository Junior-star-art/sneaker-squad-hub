import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

console.log('Initializing application...', {
  environment: import.meta.env.MODE,
  timestamp: new Date().toISOString()
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        errorHandler: (error: Error) => {
          console.error('Query error:', {
            error,
            timestamp: new Date().toISOString()
          });
        }
      }
    },
  },
});

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found', {
    documentBody: document.body.innerHTML,
    timestamp: new Date().toISOString()
  });
  throw new Error('Root element not found');
}

console.log('Mounting React application...', {
  rootElement: root,
  timestamp: new Date().toISOString()
});

try {
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  console.log('Application mounted successfully', {
    timestamp: new Date().toISOString()
  });
} catch (error) {
  console.error('Critical error during application mount:', {
    error,
    timestamp: new Date().toISOString()
  });
  throw error;
}