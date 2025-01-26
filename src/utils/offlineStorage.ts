interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export const offlineStorage = {
  saveToCache: async (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithSync;
        if (registration.sync) {
          await registration.sync.register('syncCart');
        } else {
          console.log('Background Sync not supported');
          // Implement immediate sync fallback
          await syncData(key, data);
        }
      }
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },

  getFromCache: (key: string, maxAge?: number) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      if (maxAge && Date.now() - timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  clearCache: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  },

  isOnline: () => {
    return navigator.onLine;
  },

  registerOnlineStatusHandlers: (onOnline: () => void, onOffline: () => void) => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
};

async function syncData(key: string, data: any) {
  // Implement your sync logic here based on the key
  // This is a fallback for when Background Sync is not available
  console.log('Syncing data:', key, data);
}