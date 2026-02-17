import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-lg border border-red-100 p-4 z-50 animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <Heart className="w-6 h-6 text-red-500 fill-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">Add Love Logger to your home screen</p>
          <p className="text-xs text-gray-500 mt-0.5">Quick access to your memories</p>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>
      <button
        onClick={handleInstall}
        className="mt-3 w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Install
      </button>
    </div>
  );
};
