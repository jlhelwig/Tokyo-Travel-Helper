'use client';

import { useState, useEffect, useRef } from 'react';
import { japanData } from '@/data/japanData';
import { getDistanceInMiles, formatDistance, getStatus } from '@/utils/geo';

export default function Home() {
  const [userState, setUserState] = useState({ hotel: 'Millennium Mitsui Garden Hotel', coords: { lat: 35.6703, lng: 139.7675 }, agenda: {} });
  const [setupMode, setSetupMode] = useState(false); // Disable setup for testing
  const [hotel, setHotel] = useState('Millennium Mitsui Garden Hotel');
  const [coords, setCoords] = useState({ lat: 35.6703, lng: 139.7675 });
  const [agendaNotes, setAgendaNotes] = useState({});
  const inputRef = useRef(null);
  
  const isProd = process.env.NODE_ENV === 'production';

  const dates = [
    '2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', 
    '2026-06-04', '2026-06-05', '2026-06-06', '2026-06-07'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('tokyo_trip_2026');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState(parsed);
      setHotel(parsed.hotel);
      if (parsed.coords) setCoords(parsed.coords);
    } else {
      setSetupMode(true);
    }

    if (isProd && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, [isProd]);

  useEffect(() => {
    if (setupMode && inputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["geometry", "name"],
        componentRestrictions: { country: "JP" } // Restrict to Japan
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
           setHotel(place.name || inputRef.current.value);
           setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        }
      });
    }
  }, [setupMode]);

  const handleSetup = (e) => {
    e.preventDefault();
    const agenda = dates.reduce((acc, date) => {
      acc[date] = agendaNotes[date] || '';
      return acc;
    }, {});
    const newState = { hotel, coords, agenda };
    localStorage.setItem('tokyo_trip_2026', JSON.stringify(newState));
    setUserState(newState);
    setSetupMode(false);
  };

  if (setupMode) {
    return (
      <div className="p-m flex-col gap-m" style={{ paddingBottom: '100px' }}>
        <h1 className="glow-text" style={{ fontSize: '2.5rem', lineHeight: '1' }}>Konnichiwa! 🗼</h1>
        <p style={{ color: 'var(--text-dim)' }}>Let's customize your Japan experience.</p>
        
        <form onSubmit={handleSetup} className="flex-col gap-m" style={{ marginTop: '20px' }}>
          <div className="flex-col gap-s">
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>WHERE ARE YOU STAYING?</label>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="e.g. Shinjuku, Shibuya, Asakusa..."
              defaultValue={hotel}
              onChange={(e) => setHotel(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div className="flex-col gap-s" style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>DAILY AGENDA (OPTIONAL)</label>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Add any pre-planned tours or flights.</p>
            {dates.map(date => (
              <div key={date} className="flex-col gap-xs" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                <input 
                  type="text"
                  placeholder="Notes..."
                  value={agendaNotes[date] || ''}
                  onChange={(e) => setAgendaNotes({...agendaNotes, [date]: e.target.value})}
                  className="premium-input-small"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">Start My Experience</button>
        </form>
      </div>
    );
  }

  // Dashboard Logic
  const today = isProd ? new Date() : new Date('2026-06-01'); // Real date in prod, mock June 1st in dev
  const todayStr = today.toISOString().split('T')[0];
  
  const allItems = [...japanData.events, ...japanData.shopping, ...japanData.food];
  
  // Smart Filter: Focus on what's active/open
  const suggestions = allItems.map(item => {
    const status = getStatus(item.hours, item.closedOn);
    let dist = null;
    if (coords && item.coords) {
      dist = getDistanceInMiles(coords.lat, coords.lng, item.coords.lat, item.coords.lng);
    }
    return { ...item, status, dist };
  }).filter(item => {
    if (item.dates) {
      const start = new Date(item.dates[0]);
      const end = new Date(item.dates[1] || item.dates[0]);
      if (today < start || today > end) return false;
    }
    // Location context filter! Only show suggestions within 40 miles of active hotel/gps
    if (item.dist !== null && item.dist > 40) return false;
    
    return true; 
  }).sort((a, b) => {
    // Prioritize Open/Opening Soon, then festivals, then distance
    if (a.status.label.includes('Open') && !b.status.label.includes('Open')) return -1;
    if (!a.status.label.includes('Open') && b.status.label.includes('Open')) return 1;
    if (a.dates && !b.dates) return -1;
    if (a.dist && b.dist) return a.dist - b.dist;
    return 0;
  });

  const dailyHighlight = suggestions[0];

  return (
    <div className="p-m flex-col gap-m" style={{ paddingBottom: '100px' }}>
      <header className="flex-col">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span>
          <span style={{ background: 'var(--secondary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>{isProd ? 'LIVE REGION TRK' : 'DEV MOCK TRK'}</span>
        </div>
        <h1 style={{ fontSize: '1.8rem' }}>Live in Japan</h1>
      </header>

      {userState.agenda[todayStr] && (
        <section className="premium-card" style={{ border: '2px dashed var(--primary)', background: 'rgba(0,242,255,0.05)' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>📌 YOUR AGENDA</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{userState.agenda[todayStr]}</p>
        </section>
      )}

      {dailyHighlight && (
        <section className="flex-col gap-s">
          <h2 style={{ fontSize: '1rem', color: 'var(--primary)' }}>💎 SMART SUGGESTION</h2>
          <div className="premium-card flex-col gap-s" style={{ border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: dailyHighlight.status.color, fontWeight: 'bold' }}>
                {dailyHighlight.status.label.toUpperCase()}
              </span>
              {dailyHighlight.dist && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {formatDistance(dailyHighlight.dist)}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>{dailyHighlight.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{dailyHighlight.description}</p>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${dailyHighlight.coords.lat},${dailyHighlight.coords.lng}&travelmode=walking`}
              target="_blank"
              className="btn-primary"
              style={{ textAlign: 'center', fontSize: '0.8rem', padding: '10px' }}
            >
              Start Walking
            </a>
          </div>
        </section>
      )}

      <section className="flex-col gap-m">
        <h2 style={{ fontSize: '1rem', color: 'var(--secondary)' }}>🔥 HAPPENING TODAY</h2>
        {suggestions.slice(1, 4).map(event => (
          <div key={event.id} className="premium-card flex-col gap-s">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div className="flex-col">
                <h3 style={{ fontSize: '1.1rem' }}>{event.name}</h3>
                <span style={{ fontSize: '0.7rem', color: event.status.color }}>{event.status.label}</span>
              </div>
              <span style={{ fontSize: '0.7rem', background: 'var(--accent)', padding: '2px 8px', borderRadius: '10px' }}>
                {event.category.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>📍 {event.location}</span>
              {event.dist && <span>· {formatDistance(event.dist)}</span>}
            </div>
          </div>
        ))}
      </section>

      <section className="flex-col gap-m" style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--primary)' }}>🕵️ SIDE QUEST NEAR {userState.hotel.toUpperCase()}</h2>
        <div className="premium-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <p style={{ fontSize: '0.9rem' }}>
            {japanData.sideQuests.find(q => q.near.toLowerCase().includes(userState.hotel.toLowerCase()) || 
                                           userState.hotel.toLowerCase().includes(q.near.toLowerCase()))?.task || 
             "Explore a local convenience store (Konbini) for limited edition seasonal snacks!"}
          </p>
        </div>
      </section>
    </div>
  );
}
