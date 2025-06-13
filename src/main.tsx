
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { toast } from '@/components/ui/use-toast';

// Performance monitoring
const reportWebVitals = (metric: any) => {
  console.log('Web Vitals:', metric);
};

// Monitor initial page load
const pageLoadTime = performance.now();
console.log('Page Load Time:', {
  timestamp: new Date().toISOString(),
  loadTime: `${pageLoadTime}ms`
});

// Offline detection
window.addEventListener('online', () => {
  toast({
    title: "You're back online!",
    description: "Your changes will now be synchronized.",
  });
});

window.addEventListener('offline', () => {
  toast({
    title: "You're offline",
    description: "Don't worry, you can still browse and your changes will be saved.",
    variant: "destructive",
  });
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
      staleTime: 5 * 60 * 1000,
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
