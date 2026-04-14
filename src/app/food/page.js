'use client';

import { japanData } from '@/data/japanData';

export default function FoodPage() {
  return (
    <div className="p-m flex-col gap-m">
      <header>
        <h1 className="glow-text">Local Bites 🍜</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Hidden gems and authentic street food.</p>
      </header>

      <div className="flex-col gap-m">
        {japanData.food.map(f => (
          <div key={f.id} className="premium-card flex-col gap-s">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{f.name}</h3>
              <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{f.location}</span>
            </div>
            <p style={{ fontSize: '0.9rem' }}>{f.description}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', background: 'var(--glass)', padding: '2px 8px', borderRadius: '4px' }}>
                {f.specialty}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="premium-card" style={{ background: 'linear-gradient(135deg, rgba(0,242,255,0.05), rgba(112,0,255,0.05))', border: '1px solid var(--accent)' }}>
        <h3 style={{ color: 'var(--primary)' }}>Pro Tip</h3>
        <p style={{ fontSize: '0.85rem' }}>Look for long queues of locals in suits - that's usually where the best and most affordable lunch spots are!</p>
      </section>

    </div>
  );
}
