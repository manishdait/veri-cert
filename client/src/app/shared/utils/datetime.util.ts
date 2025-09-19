export function parseTimestamp(timestamp: Date) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const offset = date.getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const gmtOffset = `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return `${formattedDate} at ${formattedTime} ${gmtOffset}`;
}
