import { useEffect } from 'react';
import { useNavigation } from '@/core/hooks/useNavigation';

export const HomePage = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    navigate('/vehicles');
  }, [navigate]);

  return null;
};
