export function generateToken(): string {
  // Simple token generation for demo purposes
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateETA(position: number, partySize: number, avgWaitMins: number = 15): number {
  // Initial heuristic: eta = 5 + 3 * partiesAhead + partySizeFactor (0–6)
  const baseWait = 5;
  const partiesAhead = position - 1;
  const partySizeFactor = Math.min(partySize - 1, 6);
  
  return baseWait + (3 * partiesAhead) + partySizeFactor;
}

export function formatWaitTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}
