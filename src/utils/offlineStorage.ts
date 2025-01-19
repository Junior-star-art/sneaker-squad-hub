interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export const offlineStorage = {
  saveToCache: async (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithSync;
        if (registration.sync) {
          await registration.sync.register('syncCart');
        } else {
          console.log('Background Sync not supported');
          // Implement immediate sync fallback if needed
        }
      }
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },

  getFromCache: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
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
  }
};