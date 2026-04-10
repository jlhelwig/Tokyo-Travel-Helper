export function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function formatDistance(miles) {
  if (miles < 0.1) return 'Just a few steps away';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} miles`;
}

export function getStatus(hours, closedOn = []) {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + (now.getMinutes() / 60);

  if (closedOn.includes(day)) return { label: 'Closed Today', color: 'var(--secondary)' };
  
  const { open, close } = hours;
  
  // 30-minute buffer logic for "Opening Soon"
  if (hour < open && hour >= open - 0.5) {
    return { label: 'Opening Soon', color: 'var(--primary)' };
  }

  if (hour >= open && hour < close) {
    // 60-minute buffer for "Closing Soon"
    if (hour >= close - 1) {
      return { label: 'Closing Soon', color: 'var(--secondary)' };
    }
    return { label: 'Open Now', color: '#00ff88' };
  }

  return { label: 'Closed', color: 'var(--text-dim)' };
}
