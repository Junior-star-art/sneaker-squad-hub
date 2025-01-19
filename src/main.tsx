import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// Performance monitoring
const reportWebVitals = (metric: any) => {
  console.log('Web Vitals:', metric);
  // Here you can send the metric to your analytics service
};

// Monitor initial page load
const pageLoadTime = performance.now();
console.log('Page Load Time:', {
  timestamp: new Date().toISOString(),
  loadTime: `${pageLoadTime}ms`
});

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
  const startTime = performance.now();
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  const endTime = performance.now();
  console.log('Application mounted successfully', {
    mountTime: `${endTime - startTime}ms`,
    timestamp: new Date().toISOString()
  });
  
  // Report performance metrics
  reportWebVitals({
    type: 'mount',
    value: endTime - startTime,
    timestamp: new Date().toISOString()
  });
} catch (error) {
  console.error('Critical error during application mount:', {
    error,
    timestamp: new Date().toISOString()
  });
  throw error;
}