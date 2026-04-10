'use client';

import { useState } from 'react';
import { tokyoData } from '@/data/tokyoData';

export default function ShoppingPage() {
  const [filter, setFilter] = useState('all');

  const filteredShopping = filter === 'all' 
    ? tokyoData.shopping 
    : tokyoData.shopping.filter(s => s.category === filter);

  return (
    <div className="p-m flex-col gap-m">
      <header>
        <h1 className="glow-text">Shopping 🛍️</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>From vintage threads to anime collectibles.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {['all', 'vintage', 'anime'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn-primary ${filter === cat ? '' : 'inactive'}`}
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.7rem', 
              background: filter === cat ? 'var(--primary)' : 'var(--glass)',
              color: filter === cat ? 'black' : 'white'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-col gap-m">
        {filteredShopping.map(s => (
          <div key={s.id} className="premium-card flex-col gap-s">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'var(--primary)' }}>{s.name}</h3>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{s.location}</span>
            </div>
            <p style={{ fontSize: '0.9rem' }}>{s.description}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {s.specialty}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-dim)' }}></span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.vibe}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
