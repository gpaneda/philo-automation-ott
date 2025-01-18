'use client';

import { useEffect, useState } from 'react';

interface FormattedDateProps {
  date: string;
  format?: 'long' | 'time';
}

export default function FormattedDate({ date, format = 'long' }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a stable initial format that will match between server and client
  const getStaticDate = () => {
    const d = new Date(date);
    if (format === 'long') {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'  // Use UTC to ensure consistency
      });
    }
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'  // Use UTC to ensure consistency
    });
  };

  // Only update the date format on the client side after mounting
  if (!mounted) {
    return <span suppressHydrationWarning>{getStaticDate()}</span>;
  }

  return (
    <span suppressHydrationWarning>
      {getStaticDate()}
    </span>
  );
} 