'use client';

import { useOnlineStatus } from '@/utils/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div style={{
      background: 'var(--secondary)',
      color: 'white',
      textAlign: 'center',
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      <span>📡</span>
      <span>OFFLINE MODE — USING CACHED DATA</span>
      <span>📡</span>
    </div>
  );
}
