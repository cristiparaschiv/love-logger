import webpush from 'web-push';
import { logger } from '../utils/logger';

let vapidPublicKey: string = '';

export function initVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@localhost';

  if (publicKey && privateKey) {
    vapidPublicKey = publicKey;
    webpush.setVapidDetails(subject, publicKey, privateKey);
    logger.info('VAPID keys loaded from environment');
  } else {
    const generated = webpush.generateVAPIDKeys();
    vapidPublicKey = generated.publicKey;
    webpush.setVapidDetails(subject, generated.publicKey, generated.privateKey);
    logger.warn('VAPID keys auto-generated. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in env for persistence.');
    logger.warn(`Generated VAPID_PUBLIC_KEY=${generated.publicKey}`);
    logger.warn(`Generated VAPID_PRIVATE_KEY=${generated.privateKey}`);
  }
}

export function getVapidPublicKey(): string {
  return vapidPublicKey;
}
