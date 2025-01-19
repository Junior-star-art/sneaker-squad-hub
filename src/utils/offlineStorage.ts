export const offlineStorage = {
  saveToCache: async (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('syncCart');
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