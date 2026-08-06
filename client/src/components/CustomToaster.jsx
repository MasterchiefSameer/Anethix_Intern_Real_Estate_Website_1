import React, { useEffect, useState } from 'react';
import { Toaster as Sonner } from 'sonner';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, Loader2 } from 'lucide-react';

export default function CustomToaster() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // 1. Initial detection of dark class on <html> element
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // 2. Listen to theme changes dynamically (when class="dark" is toggled in the future)
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setTheme(isDarkNow ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <Sonner
      position="bottom-right"
      theme={theme}
      richColors
      closeButton
      icons={{
        success: <CheckCircle2 className="text-green-500 w-5 h-5" />,
        error: <AlertOctagon className="text-red-500 w-5 h-5" />,
        warning: <AlertTriangle className="text-amber-500 w-5 h-5" />,
        info: <Info className="text-blue-500 w-5 h-5" />,
        loading: <Loader2 className="text-slate-500 w-5 h-5 animate-spin" />,
      }}
      toastOptions={{
        style: {
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          padding: '12px 16px',
          // Dynamic light/dark theme styling
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#1e293b',
          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDarkMode 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        },
      }}
    />
  );
}
