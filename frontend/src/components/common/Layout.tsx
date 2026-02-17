import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { InstallPrompt } from './InstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineIndicator />
      <Navigation />
      <main className="pb-16 md:pb-0">{children}</main>
      <InstallPrompt />
    </div>
  );
};
