'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { tokyoData } from '@/data/tokyoData';
import { getDistanceInMiles, formatDistance, getStatus } from '@/utils/geo';

export default function MapPage() {
  const [currentHotel, setCurrentHotel] = useState({ lat: 35.6703, lng: 139.7675, name: 'Loading...' });
  const [isProd, setIsProd] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const [userPos, setUserPos] = useState(null); // Real live GPS
  const [isMocking, setIsMocking] = useState(false); // Toggle for Shrine mock
  const [target, setTarget] = useState(null);
  const [isSearching711, setIsSearching711] = useState(false);
  const [travelMode, setTravelMode] = useState('walking');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const prod = process.env.NODE_ENV === 'production';
    setIsProd(prod);
    
    // Load hotel
    const saved = localStorage.getItem('tokyo_trip_2026');
    if (saved && prod) {
        const parsed = JSON.parse(saved);
        if (parsed.coords && parsed.hotel) {
            setCurrentHotel({ lat: parsed.coords.lat, lng: parsed.coords.lng, name: parsed.hotel });
        }
    } else if (!prod) {
        // Dev defaults
        setCurrentHotel({ lat: 35.6703, lng: 139.7675, name: 'Millennium Mitsui (Dev Mock)' });
    }

    // 1. Load Data
    const all = [
      ...tokyoData.events.map(i => ({...i, type: 'Festival', icon: '🏮'})),
      ...tokyoData.shopping.map(i => ({...i, type: 'Shop', icon: '🛍️'})),
      ...tokyoData.food.map(i => ({...i, type: 'Food', icon: '🍜'}))
    ];
    setItems(all);

    // 2. Track Live Position
    if (prod && typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log('Geolocation inhibited or failed:', err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // 3. Places Autocomplete hook for changing hotel
  useEffect(() => {
    if (showSearch && inputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["geometry", "name"],
        componentRestrictions: { country: "JP" }
      });
      
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
           const newHotel = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), name: place.name || inputRef.current.value };
           setCurrentHotel(newHotel);
           setShowSearch(false);
           setTarget(null); // Reset map

           // Save to local storage for prod
           if (isProd) {
             const saved = localStorage.getItem('tokyo_trip_2026');
             let parsed = saved ? JSON.parse(saved) : {};
             parsed.hotel = newHotel.name;
             parsed.coords = { lat: newHotel.lat, lng: newHotel.lng };
             localStorage.setItem('tokyo_trip_2026', JSON.stringify(parsed));
           }
        }
      });
      return () => window.google.maps.event.removeListener(listener);
    }
  }, [showSearch, isProd]);

  // Determine Smart Origin FIRST
  // Use mock position if testing, otherwise real GPS
  const mockShrine = { lat: 35.7020, lng: 139.7680, name: 'Kanda Shrine' };
  const effectiveUserPos = isMocking ? mockShrine : userPos;
  
  const distFromHotel = effectiveUserPos ? getDistanceInMiles(effectiveUserPos.lat, effectiveUserPos.lng, currentHotel.lat, currentHotel.lng) : 0;
  const isOutsideHotel = distFromHotel > 0.06;
  const activeOrigin = isOutsideHotel ? effectiveUserPos : currentHotel;
  const originType = isOutsideHotel ? (isMocking ? 'Mock: Kanda Shrine' : 'Live Location') : 'Hotel Base';

  // Calculate Distances Relative to Active Origin
  const processedItems = useMemo(() => {
    return items.map(item => {
      let dist = null;
      if (item.coords) {
        dist = getDistanceInMiles(activeOrigin.lat, activeOrigin.lng, item.coords.lat, item.coords.lng);
      }
      return { ...item, dist };
    })
    .filter(item => item.dist !== null && item.dist <= 10) // Only within 10 miles of ACTIVE position
    .sort((a, b) => a.dist - b.dist);
  }, [items, activeOrigin.lat, activeOrigin.lng]);

  // Map URL logic (Official Embed API)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const dirflg = travelMode === 'walking' ? 'walking' : 'transit';
  
  let mapUrl = '';
  if (target) {
    mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${activeOrigin.lat},${activeOrigin.lng}&destination=${target.lat},${target.lng}&mode=${dirflg}`;
  } else if (isSearching711) {
    mapUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=7-Eleven&center=${activeOrigin.lat},${activeOrigin.lng}&zoom=15`;
  } else {
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${activeOrigin.lat},${activeOrigin.lng}&zoom=16`;
  }

  const handleLocationClick = (item) => {
    setTarget({ lat: item.coords.lat, lng: item.coords.lng, name: item.name });
    setIsSearching711(false);
    setTravelMode('walking');
  };

  return (
    <div className="p-m flex-col gap-m" style={{ paddingBottom: '110px' }}>
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="glow-text">Live Navigator 🗺️</h1>
          <div className="flex-col" style={{ alignItems: 'flex-end' }}>
             <span style={{ 
               background: isOutsideHotel ? (isMocking ? 'var(--accent)' : 'var(--primary)') : 'var(--secondary)', 
               color: 'black', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' 
            }}>
               {originType.toUpperCase()}
             </span>
             {(userPos || isMocking) && <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>{isMocking ? 'MOCKING READY' : 'GPS ACTIVE'}</span>}
          </div>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          {isOutsideHotel ? `Routing from ${isMocking ? 'Kanda Shrine' : 'your current position'}.` : 'Routing from your Ginza base.'}
        </p>
      </header>

      <div className="premium-card" style={{ height: '400px', padding: '0', overflow: 'hidden', border: '2px solid var(--primary)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
        <iframe 
          key={`${mapUrl}-${isMocking}`} // Force re-render on origin/mock change
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex-col gap-m">
        {/* Navigation Action Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => {
              setTarget({ lat: currentHotel.lat, lng: currentHotel.lng, name: `Home: ${currentHotel.name}` });
              setIsSearching711(false);
              setTravelMode('transit');
            }}
            className="btn-primary"
            style={{ flex: 1, textAlign: 'center', background: 'var(--primary)', color: 'black', fontWeight: 'bold' }}
          >
            🏠 Directions Home
          </button>

          <button 
            onClick={() => {
              setTarget(null);
              setIsSearching711(true);
            }}
            className="btn-primary"
            style={{ flex: 1, textAlign: 'center', background: 'var(--accent)', color: 'black', fontWeight: 'bold' }}
          >
            🏪 Nearest 7-11
          </button>
          
          <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
            {showSearch ? (
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search any hotel..."
                className="premium-input-small"
                style={{ padding: '10px', height: '100%' }}
                autoFocus
              />
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="premium-input-small"
                style={{ padding: '10px', height: '100%', background: 'var(--glass)', border: '1px solid var(--accent)', color: 'white', textAlign: 'left', cursor: 'pointer' }}
              >
                🔍 Change Hotel
              </button>
            )}
          </div>
        </div>

        {/* Origin Toggle / Status Card */}
        <div className="premium-card flex-col gap-s" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex-col">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.7rem' }}>STARTING PATHS FROM:</span>
              <span style={{ fontSize: '1rem' }}>{isOutsideHotel ? (isMocking ? 'Kanda Shrine (Mock)' : 'Current GPS Location') : currentHotel.name}</span>
            </div>
            <button 
              onClick={() => setIsMocking(!isMocking)}
              className="btn-primary"
              style={{ fontSize: '0.6rem', padding: '4px 8px', background: isMocking ? 'var(--accent)' : 'transparent', color: isMocking ? 'black' : 'white', border: '1px solid var(--accent)' }}
            >
              {isMocking ? 'Disable Mock' : 'Mock: Kanda Shrine'}
            </button>
          </div>
          {!isOutsideHotel && userPos && !isMocking && <span style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>You are currently at the hotel area.</span>}
        </div>

        <h2 style={{ fontSize: '1rem', color: 'var(--secondary)', marginTop: '10px' }}>NEARBY DESTINATIONS</h2>
        
        {processedItems.map(item => (
          <div 
            key={item.id} 
            className="premium-card flex-col gap-s"
            style={{ 
              border: target?.name === item.name ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: target?.name === item.name ? 'rgba(0, 242, 255, 0.05)' : 'var(--glass)',
              transition: 'all 0.3s ease'
            }}
          >
            <div 
              style={{ cursor: 'pointer' }}
              onClick={() => handleLocationClick(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div className="flex-col" style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '4px' }}>
                    {item.description}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>{item.type.toUpperCase()} · {item.location}</span>
                </div>
                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {formatDistance(item.dist)}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button 
                onClick={() => {
                  setTarget({ lat: item.coords.lat, lng: item.coords.lng, name: item.name });
                  setIsSearching711(false);
                  setTravelMode('walking');
                }}
                className="btn-primary"
                style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  fontSize: '0.75rem',
                  background: (target?.name === item.name && travelMode === 'walking') ? 'var(--primary)' : 'transparent',
                  color: (target?.name === item.name && travelMode === 'walking') ? 'black' : 'white',
                  border: '1px solid var(--primary)'
                }}
              >
                🚶 Walk Path
              </button>
              <button 
                onClick={() => {
                  setTarget({ lat: item.coords.lat, lng: item.coords.lng, name: item.name });
                  setIsSearching711(false);
                  setTravelMode('transit');
                }}
                className="btn-primary"
                style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  background: (target?.name === item.name && travelMode === 'transit') ? 'var(--accent)' : 'transparent',
                  color: (target?.name === item.name && travelMode === 'transit') ? 'black' : 'white',
                  border: '1px solid var(--accent)'
                }}
              >
                🚃 Train Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
