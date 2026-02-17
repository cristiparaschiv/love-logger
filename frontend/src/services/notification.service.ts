import { apiService } from './api.service';

const SUBSCRIBED_KEY = 'push-subscribed';

class NotificationClientService {
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  isSubscribed(): boolean {
    return localStorage.getItem(SUBSCRIBED_KEY) === 'true';
  }

  async requestPermissionAndSubscribe(): Promise<boolean> {
    if (!this.isSupported()) return false;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from backend
      const { publicKey } = await apiService.get<{ publicKey: string }>('/notifications/vapid-public-key');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
      });

      const subJson = subscription.toJSON();

      await apiService.post('/notifications/subscribe', {
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
      });

      localStorage.setItem(SUBSCRIBED_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await apiService.post('/notifications/unsubscribe', {
          endpoint: subscription.endpoint,
        });
        await subscription.unsubscribe();
      }

      localStorage.removeItem(SUBSCRIBED_KEY);
      return true;
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const notificationClientService = new NotificationClientService();
