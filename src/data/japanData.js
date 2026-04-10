export const japanData = {
  events: [
    {
      id: 'sanno-matsuri',
      name: 'Sanno Matsuri',
      dates: ['2026-06-07', '2026-06-17'],
      location: 'Hie Shrine, Chiyoda',
      coords: { lat: 35.6747, lng: 139.7396 },
      hours: { open: 6, close: 17 },
      description: 'One of the three great festivals of Edo. Features a grand procession and historical costumes.',
      category: 'festival',
      mustSee: true,
      time: 'Daytime'
    },
    {
      id: 'torigoe-matsuri',
      name: 'Torigoe Matsuri',
      dates: ['2026-06-06', '2026-06-07'],
      location: 'Torigoe Shrine, Asakusa',
      coords: { lat: 35.7061, lng: 139.7853 },
      hours: { open: 9, close: 20 },
      description: 'Known for its 4-ton Sengan Mikoshi, the heaviest in Tokyo. Night procession with lanterns is magical.',
      category: 'festival',
      mustSee: true,
      time: 'Evening'
    },
    {
      id: 'ajisai-matsuri',
      name: 'Bunkyo Hydrangea Festival',
      dates: ['2026-06-01', '2026-06-15'],
      location: 'Hakusan Shrine',
      coords: { lat: 35.7226, lng: 139.7523 },
      hours: { open: 0, close: 24 }, // Grounds always open
      description: 'Over 3,000 hydrangeas in bloom. A classic early summer sight in Tokyo.',
      category: 'nature',
      mustSee: false,
      time: 'Anytime'
    },
    {
      id: 'kabuki-june',
      name: 'June Grand Kabuki',
      dates: ['2026-06-01', '2026-06-25'],
      location: 'Kabukiza Theatre, Ginza',
      coords: { lat: 35.6697, lng: 139.7681 },
      hours: { open: 10, close: 18 },
      description: 'Special summer performances of traditional Japanese theater.',
      category: 'culture',
      mustSee: true,
      time: 'Afternoon/Evening'
    },
    {
      id: 'gion-matsuri-early',
      name: 'Early Gion Preparations',
      dates: ['2026-06-25', '2026-06-30'],
      location: 'Yasaka Shrine, Kyoto',
      coords: { lat: 35.0037, lng: 135.7785 },
      hours: { open: 9, close: 18 },
      description: 'Early signs and preparations for Japan\'s most famous festival in Kyoto.',
      category: 'festival',
      mustSee: false,
      time: 'Daytime'
    }
  ],
  shopping: [
    {
      id: 'new-york-joe',
      name: 'New York Joe Exchange',
      location: 'Shimokitazawa',
      coords: { lat: 35.6614, lng: 139.6675 },
      hours: { open: 12, close: 20 },
      specialty: 'Vintage Clothing',
      description: 'A shop in a converted public bathhouse. High-quality curated vintage.',
      vibe: 'Trending/Bohemian',
      category: 'vintage'
    },
    {
      id: 'safari-kouenji',
      name: 'Safari Kouenji',
      location: 'Koenji',
      coords: { lat: 35.7042, lng: 139.6468 },
      hours: { open: 12, close: 20 },
      specialty: 'High-end Vintage & Workwear',
      description: 'Widely considered one of the best vintage shops for rare finds and denim.',
      vibe: 'Edgy/Authentic',
      category: 'vintage'
    },
    {
      id: 'mandarake-nakano',
      name: 'Mandarake (Nakano Broadway)',
      location: 'Nakano',
      coords: { lat: 35.7092, lng: 139.6656 },
      hours: { open: 12, close: 20 },
      specialty: 'Anime & Retro Toys',
      description: 'A labyrinth of subculture gems. Must-visit for anime fans.',
      vibe: 'Otaku/Subculture',
      category: 'anime'
    },
    {
      id: 'radio-kaikan',
      name: 'Akihabara Radio Kaikan',
      location: 'Akihabara',
      coords: { lat: 35.6983, lng: 139.7731 },
      hours: { open: 10, close: 20 },
      specialty: 'Everything Anime',
      description: '9 floors of anime, models, and collectibles.',
      vibe: 'High Energy',
      category: 'anime',
      closedOn: []
    },
    {
      id: 'teramachi-kyoto',
      name: 'Teramachi Shopping Arcade',
      location: 'Downtown Kyoto',
      coords: { lat: 35.0049, lng: 135.7669 },
      hours: { open: 10, close: 20 },
      specialty: 'Traditional Goods & Tea',
      description: 'Historic covered shopping street perfect for rainy days or souvenirs.',
      vibe: 'Historic/Bustling',
      category: 'local',
      closedOn: []
    }
  ],
  food: [
    {
      id: 'tsukiji-jogai',
      name: 'Tsukiji Outer Market',
      location: 'Tsukiji, Tokyo',
      coords: { lat: 35.6655, lng: 139.7684 },
      hours: { open: 5, close: 14 },
      closedOn: [0], // Closed Sundays
      specialty: 'Fresh Seafood & Street Food',
      description: 'The best place for breakfast sushi and grilled scallops.',
      vibe: 'Market/Bustling',
      category: 'local'
    },
    {
      id: 'oide-yokochou',
      name: 'Omoide Yokocho (Piss Alley)',
      location: 'Shinjuku, Tokyo',
      coords: { lat: 35.6934, lng: 139.6990 },
      hours: { open: 17, close: 24 },
      specialty: 'Yakitori & Motsunabe',
      description: 'Narrow alley filled with tiny izakayas. Very atmospheric.',
      vibe: 'Retro/Nostalgic',
      category: 'local'
    },
    {
      id: 'ichiran-shibuya',
      name: 'Ichiran Ramen',
      location: 'Shibuya, Tokyo',
      coords: { lat: 35.6595, lng: 139.7006 },
      hours: { open: 0, close: 24 }, // Many 24h
      specialty: 'Tonkotsu Ramen',
      description: 'Personalized ramen booths. Great for a quick, focused meal.',
      vibe: 'Minimal/Focused',
      category: 'local'
    },
    {
      id: 'nishiki-market',
      name: 'Nishiki Market',
      location: 'Kyoto',
      coords: { lat: 35.0050, lng: 135.7649 },
      hours: { open: 9, close: 18 },
      specialty: 'Kyoto Street Food',
      description: 'Known as "Kyoto\'s Kitchen". Five blocks of fresh food and regional specialties.',
      vibe: 'Market/Bustling',
      category: 'local'
    },
    {
      id: 'kikunoi-kyoto',
      name: 'Kikunoi Roan',
      location: 'Gion, Kyoto',
      coords: { lat: 35.0016, lng: 135.7725 },
      hours: { open: 17, close: 21 },
      specialty: 'Kaiseki (Traditional Course)',
      description: 'An approachable yet Michelin-starred traditional multi-course dining experience.',
      vibe: 'Elegant/Traditional',
      category: 'local'
    }
  ],
  sideQuests: [
    {
      near: 'Shimokitazawa',
      task: 'Find the "Totoro" cream puffs at Shiro-hige’s Cream Puff Factory.',
      type: 'experience'
    },
    {
      near: 'Shibuya',
      task: 'Go to the rooftop of Shibuya Sky for the best 360 view of the city.',
      type: 'explore'
    },
    {
      near: 'Nakano',
      task: 'Eat the 8-layered soft serve at Daily Chico in Nakano Broadway basement.',
      type: 'food'
    },
    {
      near: 'Asakusa',
      task: 'Try the melonpan (sweet bread) at Kagetsudo near Senso-ji.',
      type: 'food'
    },
    {
      near: 'Akihabara',
      task: 'Visit the Gachapon Hall and try to find a rare vintage capsule toy.',
      type: 'shopping'
    },
    {
      near: 'Kyoto',
      task: 'Walk through the 10,000 torii gates at Fushimi Inari Taisha (Coordinates: 34.9671, 135.7727).',
      type: 'explore'
    },
    {
      near: 'Kyoto',
      task: 'See the shining golden pavilion of Kinkaku-ji reflection on the pond (Coordinates: 35.0394, 135.7292).',
      type: 'explore'
    },
    {
      near: 'Kyoto',
      task: 'Wander through the towering Arashiyama Bamboo Grove early in the morning (Coordinates: 35.0116, 135.6720).',
      type: 'explore'
    }
  ]
};
