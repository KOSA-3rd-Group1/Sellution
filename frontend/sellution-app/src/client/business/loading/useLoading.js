import { useEffect, useState } from 'react';

export const useLoading = (delay = 300) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showLoading;
};
