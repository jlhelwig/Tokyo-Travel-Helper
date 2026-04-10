'use client';

import { useState, useEffect } from 'react';
import { tokyoData } from '@/data/tokyoData';

export default function ItineraryPage() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('tokyo_trip_2026');
    if (saved) setUserState(JSON.parse(saved));
  }, []);

  const dates = [
    '2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', 
    '2026-06-04', '2026-06-05', '2026-06-06', '2026-06-07'
  ];

  return (
    <div className="p-m flex-col gap-m" style={{ paddingBottom: '100px' }}>
      <header>
        <h1 className="glow-text">Full Agenda 📅</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Tailored for your trip</p>
      </header>

      <div className="flex-col" style={{ gap: '30px', position: 'relative', paddingLeft: '20px' }}>
        <div style={{ 
          position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', 
          background: 'linear-gradient(var(--primary), var(--secondary))', opacity: 0.3
        }}></div>

        {dates.map(date => {
          const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
          const userNote = userState?.agenda?.[date];
          const dailyEvents = tokyoData.events.filter(e => {
            const start = new Date(e.dates[0]);
            const end = new Date(e.dates[1] || e.dates[0]);
            const current = new Date(date);
            return current >= start && current <= end;
          });

          return (
            <div key={date} className="flex-col gap-s" style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', left: '-24px', top: '5px', width: '10px', height: '10px', 
                borderRadius: '50%', background: userNote ? 'var(--primary)' : 'var(--text-dim)',
                boxShadow: userNote ? `0 0 10px var(--primary)` : 'none'
              }}></div>

              <div className="flex-col">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{formattedDate.toUpperCase()}</span>
              </div>
              
              {/* User Note */}
              {userNote && (
                <div className="premium-card" style={{ borderLeft: '3px solid var(--primary)', background: 'rgba(0,242,255,0.05)' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>📍 {userNote}</p>
                </div>
              )}

              {/* Local Events */}
              {dailyEvents.map(event => (
                <div key={event.id} className="premium-card flex-col gap-xs" style={{ borderLeft: event.mustSee ? '2px solid var(--secondary)' : 'none', opacity: 0.9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem' }}>{event.name}</h4>
                    {event.mustSee && <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', fontWeight: 'bold' }}>MUST SEE</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{event.description}</p>
                </div>
              ))}

              {!userNote && dailyEvents.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No major events scheduled yet. Explore local shrines!</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
