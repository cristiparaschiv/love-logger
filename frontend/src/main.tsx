import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import 'leaflet/dist/leaflet.css';

// Register service worker manually (injectManifest strategy)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('SW registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
